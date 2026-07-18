import { HttpResponse, http } from 'msw'
import { describe, expect, it, vi } from 'vitest'
import { server } from '../../../test/msw-server'
import { API_PATHS } from './api-paths.ts'
import { fetchAlertsRepository } from './fetch-alerts-repository.ts'
import { createAlertsHandlers } from './mock/handlers.ts'

describe('fetchAlertsRepository', () => {
  it('lists isolated alert responses through the REST boundary', async () => {
    const first = await fetchAlertsRepository.list()
    first[0]!.title = 'Changed by consumer'

    const second = await fetchAlertsRepository.list()

    expect(second).toHaveLength(32)
    expect(second[0]!.title).not.toBe('Changed by consumer')
  })

  it('maps a controlled first-load 500 and succeeds on retry', async () => {
    server.use(
      ...createAlertsHandlers({ delayMs: 0, failFirstList: true }).handlers,
    )

    await expect(fetchAlertsRepository.list()).rejects.toMatchObject({
      code: 'NETWORK',
      retryable: true,
    })
    await expect(fetchAlertsRepository.list()).resolves.toHaveLength(32)
  })

  it('persists valid PATCH updates in handler state', async () => {
    const updated = await fetchAlertsRepository.update('ALT-001', {
      status: 'in_review',
      assignedTo: 'Alex Morgan',
    })

    expect(updated).toMatchObject({
      status: 'in_review',
      assignedTo: 'Alex Morgan',
    })
    expect((await fetchAlertsRepository.list())[0]).toMatchObject(updated)
  })

  it('maps unknown IDs to nonretryable NOT_FOUND errors', async () => {
    await expect(
      fetchAlertsRepository.update('missing', { status: 'resolved' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND', retryable: false })
  })

  it('maps network failures to retryable NETWORK errors', async () => {
    server.use(
      ...createAlertsHandlers({ delayMs: 0, listStatus: 503 }).handlers,
    )

    await expect(fetchAlertsRepository.list()).rejects.toMatchObject({
      code: 'NETWORK',
      retryable: true,
    })
  })

  it('maps an actual rejected global fetch to retryable NETWORK', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new TypeError('offline'),
    )

    await expect(fetchAlertsRepository.list()).rejects.toMatchObject({
      code: 'NETWORK',
      retryable: true,
      message: 'Security alerts are unavailable.',
    })
  })

  it.each([
    ['list', API_PATHS.alerts, () => fetchAlertsRepository.list()],
    [
      'update',
      `${API_PATHS.alerts}/ALT-001`,
      () => fetchAlertsRepository.update('ALT-001', { status: 'resolved' }),
    ],
  ])(
    'maps malformed successful %s payload to safe INTERNAL',
    async (_, path, request) => {
      server.use(http.all(path, () => HttpResponse.json({ unexpected: true })))

      await expect(request()).rejects.toMatchObject({
        code: 'INTERNAL',
        retryable: false,
        message: 'Security alerts returned an invalid response.',
      })
    },
  )

  it('handles a non-JSON error body without leaking parser details', async () => {
    server.use(
      http.get(
        API_PATHS.alerts,
        () => new HttpResponse('<not-json>', { status: 500 }),
      ),
    )

    await expect(fetchAlertsRepository.list()).rejects.toMatchObject({
      code: 'NETWORK',
      retryable: true,
      message: 'Security alerts are unavailable.',
    })
  })

  it('rejects invalid PATCH bodies at the API boundary', async () => {
    const response = await fetch(`${API_PATHS.alerts}/ALT-001`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'invalid' }),
    })

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Invalid alert update.',
    })
  })
})
