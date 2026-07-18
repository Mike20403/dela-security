import { AppError } from '../../../core/errors/AppError'
import { API_PATHS } from './api-paths'
import { alertSchema, alertsSchema } from './alert-schema'
import type { AlertsRepository, AlertUpdate } from './alerts-repository'
import type { Schema } from 'yup'

async function request<T>(
  path: string,
  schema: Schema<T>,
  init?: RequestInit,
): Promise<T> {
  let response: Response

  try {
    response = await fetch(path, init)
  } catch (cause) {
    throw new AppError('NETWORK', 'Security alerts are unavailable.', {
      cause,
      retryable: true,
    })
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new AppError('NOT_FOUND', 'Security alert was not found.')
    }
    if (response.status >= 500) {
      throw new AppError('NETWORK', 'Security alerts are unavailable.', {
        retryable: true,
      })
    }
    throw new AppError('VALIDATION', 'Alert update was not accepted.')
  }

  try {
    const payload: unknown = await response.json()
    return await schema.validate(payload, { strict: true })
  } catch {
    throw new AppError(
      'INTERNAL',
      'Security alerts returned an invalid response.',
    )
  }
}

export const fetchAlertsRepository: AlertsRepository = {
  list: () => request(API_PATHS.alerts, alertsSchema),
  update: (id: string, changes: AlertUpdate) =>
    request(`${API_PATHS.alerts}/${encodeURIComponent(id)}`, alertSchema, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    }),
}
