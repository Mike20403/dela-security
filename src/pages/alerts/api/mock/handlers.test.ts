import { describe, expect, it, vi } from 'vitest'
import { server } from '../../../../test/msw-server'
import { API_PATHS } from '../api-paths.ts'
import { createAlertsHandlers } from './handlers.ts'

describe('alert MSW handlers', () => {
  it('resets deterministic first-load behavior without leaking state', async () => {
    const mock = createAlertsHandlers({ delayMs: 0, failFirstList: true })
    server.use(...mock.handlers)

    expect((await fetch(API_PATHS.alerts)).status).toBe(500)
    expect((await fetch(API_PATHS.alerts)).status).toBe(200)

    mock.reset()
    expect((await fetch(API_PATHS.alerts)).status).toBe(500)
  })

  it('injects configured delay values without waiting', async () => {
    const wait = vi
      .fn<(milliseconds: number) => Promise<void>>()
      .mockResolvedValue()
    server.use(...createAlertsHandlers({ delayMs: () => 731, wait }).handlers)

    await fetch(API_PATHS.alerts)

    expect(wait).toHaveBeenCalledWith(731)
  })

  it('selects default delays within 600-900ms', async () => {
    const selected: number[] = []
    const wait = vi.fn(async (milliseconds: number) => {
      selected.push(milliseconds)
    })
    server.use(...createAlertsHandlers({ wait }).handlers)

    await fetch(API_PATHS.alerts)
    await fetch(API_PATHS.alerts)

    expect(selected).toHaveLength(2)
    expect(selected.every((value) => value >= 600 && value <= 900)).toBe(true)
  })

  it('evaluates browser-style failure selection for first request only', async () => {
    const failFirstList = vi.fn(() => true)
    server.use(...createAlertsHandlers({ delayMs: 0, failFirstList }).handlers)

    expect((await fetch(API_PATHS.alerts)).status).toBe(500)
    expect((await fetch(API_PATHS.alerts)).status).toBe(200)
    expect(failFirstList).toHaveBeenCalledTimes(1)
  })
})
