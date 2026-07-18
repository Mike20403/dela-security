import { QueryClient } from '@tanstack/react-query'
import { normalizeError } from '../core/errors/AppError'

export const ALERTS_STALE_TIME = 30_000
export const ALERTS_GC_TIME = 5 * 60_000
const MAX_QUERY_RETRIES = 2

export function shouldRetryQuery(failureCount: number, error: unknown) {
  return failureCount < MAX_QUERY_RETRIES && normalizeError(error).retryable
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: ALERTS_STALE_TIME,
        gcTime: ALERTS_GC_TIME,
        retry: shouldRetryQuery,
      },
      mutations: { retry: false },
    },
  })
}

export const queryClient = createAppQueryClient()
