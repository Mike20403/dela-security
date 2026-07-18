import { setupServer } from 'msw/node'
import { createAlertsHandlers } from '../pages/alerts/api/mock/handlers'

const testAlertMock = createAlertsHandlers({ delayMs: 0 })

export const server = setupServer(...testAlertMock.handlers)
export const resetTestAlertMock = testAlertMock.reset
