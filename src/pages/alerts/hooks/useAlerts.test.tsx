import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { AppError } from '../../../core/errors/AppError'
import type { SecurityAlert } from '../../../core/types/alerts'
import type { AlertsRepository } from '../api/alerts-repository'
import { useAlerts } from './useAlerts.ts'

function wrapper(client: QueryClient) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

const seed: SecurityAlert[] = [
  {
    id: 'ALT-001',
    title: 'Kerberoasting activity detected',
    severity: 'critical',
    status: 'open',
    category: 'Credential Access',
    affectedAsset: 'svc-backup',
    domainController: 'DC01.corp.example.com',
    detectedAt: '2026-07-18T08:30:00.000Z',
    description: 'Several service tickets used weak encryption.',
    recommendedAction: 'Rotate the service account password and require AES.',
  },
]

function createClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  })
}

describe('useAlerts', () => {
  it('returns repository records with no provider coupling beyond QueryClient', async () => {
    const repository: AlertsRepository = {
      list: async () => seed.map((alert) => ({ ...alert })),
      update: async () => seed[0]!,
    }
    const { result } = renderHook(() => useAlerts(repository), {
      wrapper: wrapper(createClient()),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(seed)
  })

  it('exposes normalized repository errors', async () => {
    const error = new AppError('NETWORK', 'Security alerts are unavailable.', {
      retryable: true,
    })
    const repository: AlertsRepository = {
      list: () => Promise.reject(error),
      update: () => Promise.reject(error),
    }
    const { result } = renderHook(() => useAlerts(repository), {
      wrapper: wrapper(createClient()),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBe(error)
  })
})
