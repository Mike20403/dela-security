import { setupWorker } from 'msw/browser'
import { browserAlertMock } from './handlers'

export const worker = setupWorker(...browserAlertMock.handlers)
