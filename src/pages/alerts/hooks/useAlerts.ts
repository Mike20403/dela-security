import { useQuery } from '@tanstack/react-query'
import { getAllAlertOverrides } from '../../../core/persistence/db'
import { alertKeys } from '../api/alert-query-keys'
import type { AlertsRepository } from '../api/alerts-repository'
import { fetchAlertsRepository } from '../api/fetch-alerts-repository'

export function useAlerts(
  repository: AlertsRepository = fetchAlertsRepository,
) {
  return useQuery({
    queryKey: alertKeys.list(),
    queryFn: async () => {
      const [alerts, overrides] = await Promise.all([
        repository.list(),
        getAllAlertOverrides(),
      ])
      return alerts.map((alert) =>
        overrides[alert.id] ? { ...alert, ...overrides[alert.id] } : alert,
      )
    },
  })
}
