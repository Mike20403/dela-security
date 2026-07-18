import { describe, expect, it } from 'vitest'
import { AppError } from '../core/errors/AppError'
import {
  ALERTS_GC_TIME,
  ALERTS_STALE_TIME,
  createAppQueryClient,
  shouldRetryQuery,
} from './query-client'

describe('production query defaults', () => {
  it('keeps alert data fresh briefly and inactive data cached', () => {
    const options = createAppQueryClient().getDefaultOptions().queries

    expect(options?.staleTime).toBe(ALERTS_STALE_TIME)
    expect(options?.gcTime).toBe(ALERTS_GC_TIME)
    expect(ALERTS_STALE_TIME).toBe(30_000)
    expect(ALERTS_GC_TIME).toBe(5 * 60_000)
  })

  it('retries only retryable errors, capped at two retries', () => {
    const transient = new AppError('NETWORK', 'Connection unavailable.', {
      retryable: true,
    })

    expect(shouldRetryQuery(0, transient)).toBe(true)
    expect(shouldRetryQuery(1, transient)).toBe(true)
    expect(shouldRetryQuery(2, transient)).toBe(false)
    expect(shouldRetryQuery(0, new Error('invalid response'))).toBe(false)
    expect(
      shouldRetryQuery(
        0,
        new AppError('VALIDATION', 'Invalid request.', { retryable: false }),
      ),
    ).toBe(false)
  })
})
