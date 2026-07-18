import { delay, http, HttpResponse } from 'msw'
import type { AlertStatus, SecurityAlert } from '../../../../core/types/alerts'
import { API_PATHS } from '../api-paths'
import { mockAlerts } from '../mock-alerts'

const statuses = new Set<AlertStatus>([
  'open',
  'in_review',
  'resolved',
  'suppressed',
])

interface AlertsHandlerOptions {
  delayMs?: number | (() => number)
  failFirstList?: boolean | (() => boolean)
  listStatus?: number
  wait?: (milliseconds: number) => Promise<void>
}

const clone = (alert: SecurityAlert): SecurityAlert => ({ ...alert })

function isAlertUpdate(value: unknown): value is {
  status?: AlertStatus
  assignedTo?: string
} {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const update = value as Record<string, unknown>
  const keys = Object.keys(update)
  return (
    keys.length > 0 &&
    keys.every((key) => key === 'status' || key === 'assignedTo') &&
    (update.status === undefined ||
      statuses.has(update.status as AlertStatus)) &&
    (update.assignedTo === undefined ||
      (typeof update.assignedTo === 'string' &&
        update.assignedTo.trim() !== ''))
  )
}

export function createAlertsHandlers(options: AlertsHandlerOptions = {}) {
  let alerts = mockAlerts.map(clone)
  let firstListPending = true
  const wait = options.wait ?? delay
  const waitForResponse = () =>
    wait(
      typeof options.delayMs === 'function'
        ? options.delayMs()
        : (options.delayMs ?? 600 + Math.floor(Math.random() * 301)),
    )

  return {
    handlers: [
      http.get(API_PATHS.alerts, async () => {
        await waitForResponse()
        const firstList = firstListPending
        firstListPending = false
        const failFirst =
          firstList &&
          (typeof options.failFirstList === 'function'
            ? options.failFirstList()
            : (options.failFirstList ?? false))

        if (options.listStatus) {
          return HttpResponse.json(
            { error: 'Security alerts are unavailable.' },
            { status: options.listStatus },
          )
        }
        if (firstList && failFirst) {
          return HttpResponse.json(
            { error: 'Security alerts are unavailable.' },
            { status: 500 },
          )
        }
        return HttpResponse.json(alerts.map(clone))
      }),
      http.patch(`${API_PATHS.alerts}/:id`, async ({ params, request }) => {
        await waitForResponse()
        let body: unknown
        try {
          body = await request.json()
        } catch {
          return HttpResponse.json(
            { error: 'Invalid alert update.' },
            { status: 400 },
          )
        }
        if (!isAlertUpdate(body)) {
          return HttpResponse.json(
            { error: 'Invalid alert update.' },
            { status: 400 },
          )
        }

        const index = alerts.findIndex((alert) => alert.id === params.id)
        const current = alerts[index]
        if (!current) {
          return HttpResponse.json(
            { error: 'Security alert was not found.' },
            { status: 404 },
          )
        }

        const updated = { ...current, ...body }
        alerts[index] = updated
        return HttpResponse.json(clone(updated))
      }),
    ],
    reset() {
      alerts = mockAlerts.map(clone)
      firstListPending = true
    },
  }
}

export const browserAlertMock = createAlertsHandlers({
  failFirstList: () => Math.random() < 0.2,
})
