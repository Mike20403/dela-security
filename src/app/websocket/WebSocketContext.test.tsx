import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, renderHook } from '@testing-library/react'
import { App as AntApp } from 'antd'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { alertKeys } from '../../pages/alerts/api/alert-query-keys'
import type { SecurityAlert } from '../../core/types/alerts'
import { useWebSocketContext } from './useWebSocketContext'
import { WebSocketProvider } from './WebSocketContext'

function wrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AntApp>
          <WebSocketProvider>{children}</WebSocketProvider>
        </AntApp>
      </QueryClientProvider>
    )
  }
}

describe('useWebSocketContext', () => {
  it('throws when used outside of WebSocketProvider', () => {
    const { result } = renderHook(() => {
      try {
        return useWebSocketContext()
      } catch (error) {
        return error
      }
    })

    expect(result.current).toBeInstanceOf(Error)
    expect((result.current as Error).message).toMatch(
      /useWebSocketContext must be used within a WebSocketProvider/,
    )
  })
})

describe('WebSocketProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('prepends a new mock alert into the alerts list cache every 30 seconds and shows a notification', async () => {
    const queryClient = new QueryClient()
    const existingAlert: SecurityAlert = {
      id: 'ALT-001',
      title: 'Existing alert',
      severity: 'high',
      status: 'open',
      category: 'Test',
      affectedAsset: 'asset',
      domainController: 'dc',
      detectedAt: new Date().toISOString(),
      description: 'desc',
      recommendedAction: 'action',
    }
    queryClient.setQueryData(alertKeys.list(), [existingAlert])

    render(<div />, { wrapper: wrapper(queryClient) })

    await vi.advanceTimersByTimeAsync(30_000)

    const data = queryClient.getQueryData<SecurityAlert[]>(alertKeys.list())
    expect(data).toHaveLength(2)
    expect(data?.[0]).not.toBe(existingAlert)
    expect(data?.[1]).toBe(existingAlert)
    expect(document.body.textContent).toMatch(/1 new alert received/)
  })
})
