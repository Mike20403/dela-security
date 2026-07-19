import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
// Temporary until Phase 2 replaces runtime injection with static system variables.
import { applyCssVariables } from './core/theme/internal/legacy-theme-compat'
import './styles/global.css'

applyCssVariables()

if (import.meta.env.DEV) {
  const { worker } = await import('./pages/alerts/api/mock/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

const root = document.getElementById('root')

if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
