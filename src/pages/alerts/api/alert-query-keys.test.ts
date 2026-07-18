import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import type { AlertsRepository } from './alerts-repository'
import { alertKeys, alertListOptions } from './alert-query-keys'

describe('alert query foundations', () => {
  it('provides stable hierarchical keys', () => {
    expect(alertKeys.all).toEqual(['alerts'])
    expect(alertKeys.lists()).toEqual(['alerts', 'list'])
    expect(alertKeys.list()).toEqual(['alerts', 'list', {}])
    expect(alertKeys.list()).toEqual(alertKeys.list())
  })

  it('shares typed list options with the query cache', async () => {
    const repository: AlertsRepository = {
      list: async () => [],
      update: async () => {
        throw new Error('Not used')
      },
    }
    const options = alertListOptions(repository)
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })

    await expect(client.fetchQuery(options)).resolves.toEqual([])
    expect(client.getQueryData(options.queryKey)).toEqual([])
  })
})
