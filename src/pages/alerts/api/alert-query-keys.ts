import { queryOptions } from '@tanstack/react-query'
import type { AlertsRepository } from './alerts-repository'

export const alertKeys = {
  all: ['alerts'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  list: () => [...alertKeys.lists(), {}] as const,
}

export function alertListOptions(repository: AlertsRepository) {
  return queryOptions({
    queryKey: alertKeys.list(),
    queryFn: () => repository.list(),
  })
}
