import { Alert, Button, Result } from 'antd'
import { useMemo, useState } from 'react'
import type { SecurityAlert } from '../../core/types/alerts'
import {
  countAlertsByStatus,
  filterAlertsByTab,
  type AlertTabId,
} from './alert-derivations'
import { AlertsTable } from './components/AlertsTable'
import { AlertsTableSkeleton } from './components/AlertsTableSkeleton'
import { SummaryStats } from './components/SummaryStats'
import {
  TabNavigation,
  type TabNavigationItem,
} from './components/TabNavigation'
import { useAlerts } from './hooks/useAlerts'

const emptyAlerts: never[] = []

export function AlertsPage() {
  const query = useAlerts()
  const [activeTab, setActiveTab] = useState<AlertTabId>('all')
  const [, setSelectedAlert] = useState<SecurityAlert>()
  const alerts = query.data ?? emptyAlerts
  const visibleAlerts = useMemo(
    () => filterAlertsByTab(alerts, activeTab),
    [alerts, activeTab],
  )
  const counts = countAlertsByStatus(alerts)
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
          <SummaryStats alerts={visibleAlerts} />
          <section className="border-border-default bg-surface-container rounded-md border px-md shadow-sm">
            <TabNavigation
              items={tabs}
              activeId={activeTab}
              onChange={setActiveTab}
            />
            <AlertsTable
              alerts={visibleAlerts}
              onSelectAlert={setSelectedAlert}
            />
          </section>
        </div>
      )}
    </main>
  )
}
