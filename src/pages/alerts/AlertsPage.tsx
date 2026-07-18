import { Alert, App, Button, Result } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import type { AlertStatus, SecurityAlert } from '../../core/types/alerts'
import {
  countAlertsByStatus,
  filterAlertsByTab,
  type AlertTabId,
} from './alert-derivations'
import { filterAlerts } from './alert-filters'
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
  useEffect(() => {
    if (query.data && selectedAlertId && !selectedAlert) {
      const timeout = window.setTimeout(() => setSelectedAlertId(undefined), 0)
      return () => window.clearTimeout(timeout)
    }
  }, [query.data, selectedAlert, selectedAlertId])
  const tabs: readonly TabNavigationItem<AlertTabId>[] = [
    { id: 'all', label: 'All', badge: counts.all },
    { id: 'open', label: 'Open', badge: counts.open },
    { id: 'in_review', label: 'In Review', badge: counts.in_review },
    { id: 'resolved', label: 'Resolved', badge: counts.resolved },
  ]

  return (
    <main className="mx-auto max-w-[100rem] p-md lg:p-xl">
      <header className="mb-lg flex flex-wrap items-end justify-between gap-md">
        <div>
          <p className="text-text-secondary m-0 text-sm font-medium">
            Security operations
          </p>
          <h1 className="text-text-primary m-0 mt-xs text-xl font-semibold">
            Security alerts
          </h1>
        </div>
        <p className="text-text-secondary m-0 text-sm">
          Directory threat monitoring
        </p>
      </header>

      {query.isPending ? (
        <AlertsTableSkeleton />
      ) : query.isError && !query.data ? (
        <section className="border-border-default bg-surface-container rounded-md border">
          <Result
            status="error"
            title="Unable to load security alerts"
            subTitle="Alert data is unavailable. Try the request again."
            extra={
              <button
                type="button"
                className="bg-action-primary text-text-inverse hover:bg-action-hover rounded-md border-0 px-md py-sm font-medium"
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
          <section className="border-border-default bg-surface-container rounded-md border px-md shadow-sm">
            <TabNavigation
              items={tabs}
              activeId={activeTab}
              onChange={setActiveTab}
            />
            <AlertsTable
              alerts={visibleAlerts}
              onSelectAlert={(alert) => setSelectedAlertId(alert.id)}
            />
          </section>
          {selectedAlertId && (
            <MutatingAlertDrawer
              alert={selectedAlert}
              onClose={() => setSelectedAlertId(undefined)}
            />
          )}
        </div>
      )}
    </main>
  )
}

function MutatingAlertDrawer({
  alert,
  onClose,
}: {
  alert: SecurityAlert | undefined
  onClose: () => void
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
      open
      pending={mutation.isPending}
      onClose={onClose}
      onStatusChange={(status) => update({ status })}
      onAssignToMe={() => update({ assignedTo: 'Alex Morgan' })}
    />
  )
}
