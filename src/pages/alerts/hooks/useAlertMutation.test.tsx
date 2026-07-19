import { QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import * as db from '../../../core/persistence/db'
import type { SecurityAlert } from '../../../core/types/alerts'
import { createTestQueryClient } from '../../../test/query-client'
import { alertKeys } from '../api/alert-query-keys'
import type { AlertsRepository } from '../api/alerts-repository'
import { useAlertMutation } from './useAlertMutation'

vi.mock('../../../core/persistence/db', () => ({
  putAlertOverride: vi.fn().mockResolvedValue(undefined),
}))

const alert: SecurityAlert = {
  id: 'alert-1',
  title: 'Alert',
  severity: 'high',
  status: 'open',
  category: 'Persistence',
  affectedAsset: 'KRBTGT',
  domainController: 'DC01.example.com',
  detectedAt: '2026-07-18T12:00:00Z',
  description: 'Description',
  recommendedAction: 'Action',
}

function setup(update: AlertsRepository['update']) {
  const client = createTestQueryClient()
  client.setQueryData(alertKeys.list(), [alert])
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const hook = renderHook(() => useAlertMutation({ list: vi.fn(), update }), {
    wrapper,
  })
  return { client, ...hook }
}

describe('useAlertMutation', () => {
  it('cancels and updates list cache before response, then keeps success', async () => {
    let resolve!: (value: SecurityAlert) => void
    const update = vi.fn(
      () => new Promise<SecurityAlert>((done) => (resolve = done)),
    )
    const { client, result } = setup(update)
    const cancel = vi.spyOn(client, 'cancelQueries')
    const invalidate = vi.spyOn(client, 'invalidateQueries')

    act(() =>
      result.current.mutate({ id: alert.id, changes: { status: 'resolved' } }),
    )
    await waitFor(() =>
      expect(
        client.getQueryData<SecurityAlert[]>(alertKeys.list())?.[0]?.status,
      ).toBe('resolved'),
    )
    expect(cancel).toHaveBeenCalledWith({ queryKey: alertKeys.list() })

    resolve({ ...alert, status: 'resolved' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      client.getQueryData<SecurityAlert[]>(alertKeys.list())?.[0]?.status,
    ).toBe('resolved')
    expect(invalidate).toHaveBeenCalledWith({ queryKey: alertKeys.list() })
  })

  it('rolls cache back when update fails', async () => {
    const { client, result } = setup(
      vi.fn().mockRejectedValue(new Error('secret')),
    )
    const invalidate = vi.spyOn(client, 'invalidateQueries')

    act(() =>
      result.current.mutate({
        id: alert.id,
        changes: { assignedTo: 'Alex Morgan' },
      }),
    )
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(
      client.getQueryData<SecurityAlert[]>(alertKeys.list())?.[0]?.assignedTo,
    ).toBeUndefined()
    expect(invalidate).toHaveBeenCalledWith({ queryKey: alertKeys.list() })
  })

  it('persists the status change to Dexie once the mutation succeeds', async () => {
    const update = vi.fn().mockResolvedValue({ ...alert, status: 'resolved' })
    const { result } = setup(update)

    act(() =>
      result.current.mutate({ id: alert.id, changes: { status: 'resolved' } }),
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(db.putAlertOverride).toHaveBeenCalledWith(alert.id, {
      status: 'resolved',
    })
  })

  it('reconciles only requested server fields and preserves overlapping optimistic fields', async () => {
    const update = vi.fn().mockResolvedValue({
      ...alert,
      status: 'resolved' as const,
      assignedTo: 'stale server assignment',
    })
    const { client, result } = setup(update)
    client.setQueryData(alertKeys.list(), [
      { ...alert, assignedTo: 'New analyst' },
    ])

    act(() =>
      result.current.mutate({ id: alert.id, changes: { status: 'resolved' } }),
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(
      client.getQueryData<SecurityAlert[]>(alertKeys.list())?.[0],
    ).toMatchObject({
      status: 'resolved',
      assignedTo: 'New analyst',
    })
    expect(update).toHaveBeenCalledWith(alert.id, { status: 'resolved' })
  })

  it('does not let an older failure erase a newer overlapping success', async () => {
    let rejectOlder!: (error: Error) => void
    let resolveNewer!: (value: SecurityAlert) => void
    const update = vi
      .fn<AlertsRepository['update']>()
      .mockImplementationOnce(
        () => new Promise((_resolve, reject) => (rejectOlder = reject)),
      )
      .mockImplementationOnce(
        () => new Promise((resolve) => (resolveNewer = resolve)),
      )
    const { client, result } = setup(update)
    const invalidate = vi.spyOn(client, 'invalidateQueries')

    act(() =>
      result.current.mutate({ id: alert.id, changes: { status: 'in_review' } }),
    )
    await waitFor(() =>
      expect(
        client.getQueryData<SecurityAlert[]>(alertKeys.list())?.[0],
      ).toMatchObject({
        status: 'in_review',
      }),
    )
    act(() =>
      result.current.mutate({ id: alert.id, changes: { status: 'resolved' } }),
    )
    await waitFor(() => expect(update).toHaveBeenCalledTimes(2))

    resolveNewer({ ...alert, status: 'resolved', assignedTo: 'Server owner' })
    await waitFor(() =>
      expect(
        client.getQueryData<SecurityAlert[]>(alertKeys.list())?.[0]?.status,
      ).toBe('resolved'),
    )
    rejectOlder(new Error('older request failed'))
    await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(2))
    expect(
      client.getQueryData<SecurityAlert[]>(alertKeys.list())?.[0]?.status,
    ).toBe('resolved')
    expect(update).toHaveBeenNthCalledWith(1, alert.id, { status: 'in_review' })
    expect(update).toHaveBeenNthCalledWith(2, alert.id, { status: 'resolved' })
  })
})
