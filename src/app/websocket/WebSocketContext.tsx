import { useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { useEffect, type ReactNode } from 'react'
import type { SecurityAlert } from '../../core/types/alerts'
import { alertKeys } from '../../pages/alerts/api/alert-query-keys'
import { createMockAlert } from './mock-websocket-alert'
import { WebSocketContext } from './websocket-context-value'

const TICK_INTERVAL_MS = 30_000

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const { notification } = App.useApp()

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newAlert = createMockAlert()
      queryClient.setQueryData<SecurityAlert[]>(alertKeys.list(), (old) => [
        newAlert,
        ...(old ?? []),
      ])
      notification.info({
        message: '1 new alert received',
        placement: 'topRight',
      })
    }, TICK_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [queryClient, notification])

  return (
    <WebSocketContext.Provider value={{ isConnected: true }}>
      {children}
    </WebSocketContext.Provider>
  )
}
