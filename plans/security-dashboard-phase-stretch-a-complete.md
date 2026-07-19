## Phase Complete: Stretch Goal A — WebSocket Real-Time Simulation

Added a simulated real-time alert feed: every 30 seconds a new mock alert is prepended into the TanStack Query cache and an Ant Design notification fires, with the alerts table updating automatically via React Query reactivity.

**Files created/changed:**
- src/app/websocket/WebSocketContext.tsx
- src/app/websocket/websocket-context-value.ts
- src/app/websocket/useWebSocketContext.ts
- src/app/websocket/mock-websocket-alert.ts
- src/app/websocket/WebSocketContext.test.tsx
- src/app/providers.tsx

**Functions created/changed:**
- WebSocketProvider
- useWebSocketContext
- createMockAlert

**Tests created/changed:**
- useWebSocketContext throws outside WebSocketProvider
- cache receives new alert + notification shown after 30s interval

**Review Status:** APPROVED

**Git Commit Message:**
```
feat: add simulated real-time alert WebSocket

- Add WebSocketContext/useWebSocketContext standard React context
- Prepend mock alert into TanStack Query cache every 30s
- Show Ant Design notification on new alert arrival
- Reuse severityPresentation/statusPresentation, no new deps
```
