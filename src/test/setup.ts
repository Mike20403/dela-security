import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { alertOverridesDb } from '../core/persistence/db'
import { resetTestAlertMock, server } from './msw-server'

// jsdom has no canvas rendering backend, so Chart.js cannot mount. Tests that
// need real dataset/prop assertions can still override this mock per-file.
vi.mock('react-chartjs-2', () => ({
  Bar: () => null,
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetTestAlertMock()
  return alertOverridesDb.alertOverrides.clear()
})

afterAll(() => server.close())
