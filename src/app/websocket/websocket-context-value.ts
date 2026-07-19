import { createContext } from 'react'

export interface WebSocketContextValue {
  isConnected: boolean
}

export const WebSocketContext = createContext<WebSocketContextValue | null>(
  null,
)
