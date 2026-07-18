import { useQuery } from '@tanstack/react-query'
import { alertListOptions } from '../api/alert-query-keys'
import type { AlertsRepository } from '../api/alerts-repository'
import { fetchAlertsRepository } from '../api/fetch-alerts-repository'

export function useAlerts(
  repository: AlertsRepository = fetchAlertsRepository,
) {
  return useQuery(alertListOptions(repository))
}
