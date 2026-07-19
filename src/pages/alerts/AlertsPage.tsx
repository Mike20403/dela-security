import { Alert, App, Button, Result } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { AlertStatus, SecurityAlert } from '../../core/types/alerts'
import {
  countAlertsByStatus,
  filterAlertsByTab,
  type AlertTabId,
} from './alert-derivations'
import { filterAlerts } from './alert-filters'
import { statusPresentation } from './alert-presentation'
import { AlertDetailDrawer } from './components/AlertDetailDrawer'
import { AlertsTable } from './components/AlertsTable'
import { AlertsTableSkeleton } from './components/AlertsTableSkeleton'
import { FilterPanel } from './components/FilterPanel'
import { SummaryStats } from './components/SummaryStats'
import {
  TabNavigation,
  type TabNavigationItem,
} from './components/TabNavigation'
import { useAlerts } from './hooks/useAlerts'
import { useAlertFilters } from './hooks/useAlertFilters'
import { useAlertMutation } from './hooks/useAlertMutation'

const emptyAlerts: never[] = []

export function AlertsPage() {
  const query = useAlerts()
  const [activeTab, setActiveTab] = useState<AlertTabId>('all')
  const [selectedAlertId, setSelectedAlertId] = useState<string>()
  const [drawerAlert, setDrawerAlert] = useState<SecurityAlert>()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const openerRef = useRef<HTMLElement | null>(null)
  const pageHeadingRef = useRef<HTMLHeadingElement>(null)
  const filterState = useAlertFilters(() => setActiveTab('all'))
  const alerts = query.data ?? emptyAlerts
  const filteredAlerts = useMemo(
    () => filterAlerts(alerts, filterState.filters),
    [alerts, filterState.filters],
  )
  const visibleAlerts = useMemo(
    () => filterAlertsByTab(filteredAlerts, activeTab),
    [filteredAlerts, activeTab],
  )
  const counts = countAlertsByStatus(filteredAlerts)
  const categories = useMemo(
    () => [...new Set(alerts.map(({ category }) => category))].sort(),
    [alerts],
  )
  const selectedAlert = alerts.find(({ id }) => id === selectedAlertId)
  const effectiveDrawerOpen = drawerOpen && Boolean(selectedAlert)
  const openDrawer = (alert: SecurityAlert) => {
    openerRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    setDrawerAlert(alert)
    setSelectedAlertId(alert.id)
    setDrawerOpen(true)
  }
  const finishDrawerTransition = (open: boolean) => {
    if (open) return
    setSelectedAlertId(undefined)
    setDrawerAlert(undefined)
    if (openerRef.current?.isConnected) openerRef.current.focus()
    else pageHeadingRef.current?.focus()
    openerRef.current = null
  }
  const tabs: readonly TabNavigationItem<AlertTabId>[] = [
    { id: 'all', label: 'All', badge: counts.all },
    { id: 'open', label: statusPresentation.open.label, badge: counts.open },
    {
      id: 'in_review',
      label: statusPresentation.in_review.label,
      badge: counts.in_review,
    },
    {
      id: 'resolved',
      label: statusPresentation.resolved.label,
      badge: counts.resolved,
    },
  ]

  return (
    <main className="mx-auto max-w-[100rem] p-md lg:p-xl">
      <header className="mb-lg flex flex-wrap items-end justify-between gap-md">
        <div>
          <p className="text-foreground-muted m-0 text-sm font-medium">
            Security operations
          </p>
          <h1
            ref={pageHeadingRef}
            tabIndex={-1}
            className="text-foreground-default m-0 mt-xs text-xl font-semibold"
          >
            Security alerts
          </h1>
        </div>
        <p className="text-foreground-muted m-0 text-sm">
          Directory threat monitoring
        </p>
      </header>

      {query.isPending ? (
        <AlertsTableSkeleton />
      ) : query.isError && !query.data ? (
        <section className="border-border-default bg-background-surface rounded-md border">
          <Result
            status="error"
            title="Unable to load security alerts"
            subTitle="Alert data is unavailable. Try the request again."
            extra={
              <button
                type="button"
                className="bg-action-primary text-foreground-inverse hover:bg-action-hover rounded-md border-0 px-md py-sm font-medium"
                onClick={() => void query.refetch()}
              >
                Retry
              </button>
            }
          />
        </section>
      ) : (
        <div className="space-y-lg">
          {query.isError && (
            <Alert
              type="warning"
              showIcon
              message="Showing cached alerts because refresh failed."
              action={
                <Button size="small" onClick={() => void query.refetch()}>
                  Retry refresh
                </Button>
              }
            />
          )}
          <FilterPanel
            form={filterState.form}
            filters={filterState.filters}
            categories={categories}
            onApply={() => void filterState.apply()}
            onReset={filterState.reset}
          />
          <SummaryStats alerts={visibleAlerts} />
          <section className="border-border-default bg-background-surface rounded-md border px-md shadow-sm">
            <TabNavigation
              items={tabs}
              activeId={activeTab}
              onChange={setActiveTab}
            />
            <AlertsTable alerts={visibleAlerts} onSelectAlert={openDrawer} />
          </section>
          {drawerAlert && (
            <MutatingAlertDrawer
              alert={selectedAlert ?? drawerAlert}
              open={effectiveDrawerOpen}
              onClose={() => setDrawerOpen(false)}
              onAfterOpenChange={finishDrawerTransition}
            />
          )}
        </div>
      )}
    </main>
  )
}

function MutatingAlertDrawer({
  alert,
  open,
  onClose,
  onAfterOpenChange,
}: {
  alert: SecurityAlert | undefined
  open: boolean
  onClose: () => void
  onAfterOpenChange: (open: boolean) => void
}) {
  const mutation = useAlertMutation()
  const { message } = App.useApp()
  useEffect(() => {
    if (mutation.isError) {
      void message.error(
        `Unable to update ${alert?.title ?? 'selected alert'}. Change reverted.`,
      )
    }
  }, [alert?.title, message, mutation.isError])
  const update = (changes: { status?: AlertStatus; assignedTo?: string }) => {
    if (!alert) return
    mutation.mutate({ id: alert.id, changes })
  }

  return (
    <AlertDetailDrawer
      alert={alert}
      open={open}
      pending={mutation.isPending}
      onClose={onClose}
      onAfterOpenChange={onAfterOpenChange}
      onStatusChange={(status) => update({ status })}
      onAssignToMe={() => update({ assignedTo: 'Alex Morgan' })}
    />
  )
}
