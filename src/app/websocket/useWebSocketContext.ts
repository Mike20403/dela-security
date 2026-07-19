import { useContext } from 'react'
import {
  WebSocketContext,
  type WebSocketContextValue,
} from './websocket-context-value'

export function useWebSocketContext(): WebSocketContextValue {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error(
      'useWebSocketContext must be used within a WebSocketProvider',
    )
  }
  return context
}
