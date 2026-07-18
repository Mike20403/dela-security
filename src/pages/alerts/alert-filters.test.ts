import { describe, expect, it } from 'vitest'
import type { SecurityAlert } from '../../core/types/alerts'
import {
  alertFilterSchema,
  defaultAlertFilters,
  type AlertFilters,
} from './alert-filter-schema.ts'
import { countActiveFilters, filterAlerts } from './alert-filters'

const alerts: SecurityAlert[] = [
  {
    id: 'one',
    title: 'Golden Ticket detected',
    severity: 'critical',
    status: 'open',
    category: 'Persistence',
    affectedAsset: 'KRBTGT',
    domainController: 'DC01.example.com',
    detectedAt: '2026-07-17T00:00:00.000Z',
    description: 'description',
    recommendedAction: 'action',
  },
  {
    id: 'two',
    title: 'LDAP policy changed',
    severity: 'medium',
    status: 'resolved',
    category: 'Configuration',
    affectedAsset: 'Default Policy',
    domainController: 'DC02.example.com',
    detectedAt: '2026-07-18T23:59:59.999Z',
    description: 'description',
    recommendedAction: 'action',
    assignedTo: 'Sam Lee',
  },
]

const filters = (changes: Partial<AlertFilters>): AlertFilters => ({
  ...defaultAlertFilters,
  ...changes,
})

describe('alert filters', () => {
  it('validates schema values and rejects invalid or reversed dates', async () => {
    await expect(
      alertFilterSchema.validate(defaultAlertFilters, { strict: true }),
    ).resolves.toEqual(defaultAlertFilters)
    await expect(
      alertFilterSchema.validate(
        filters({ dateRange: ['not-a-date', '2026-07-18'] }),
        { strict: true },
      ),
    ).rejects.toThrow('valid dates')
    await expect(
      alertFilterSchema.validate(
        filters({
          dateRange: ['2026-07-19', '2026-07-18'],
        }),
        { strict: true },
      ),
    ).rejects.toThrow('on or before')
    await expect(
      alertFilterSchema.validate(
        { ...defaultAlertFilters, unexpected: true },
        { strict: true },
      ),
    ).rejects.toThrow('unspecified keys')
  })

  it('searches trimmed title and affected asset case-insensitively', () => {
    expect(filterAlerts(alerts, filters({ search: '  golden ' }))).toEqual([
      alerts[0],
    ])
    expect(filterAlerts(alerts, filters({ search: 'default policy' }))).toEqual(
      [alerts[1]],
    )
  })

  it('filters severity, category, inclusive UTC calendar dates, and combinations', () => {
    expect(filterAlerts(alerts, filters({ severities: ['critical'] }))).toEqual(
      [alerts[0]],
    )
    expect(
      filterAlerts(alerts, filters({ categories: ['Configuration'] })),
    ).toEqual([alerts[1]])
    expect(
      filterAlerts(
        alerts,
        filters({
          dateRange: ['2026-07-18', '2026-07-18'],
        }),
      ),
    ).toEqual([alerts[1]])
    expect(
      filterAlerts(
        alerts,
        filters({
          search: 'policy',
          severities: ['medium'],
          categories: ['Configuration'],
        }),
      ),
    ).toEqual([alerts[1]])
  })

  it('counts active field groups, not selected options', () => {
    expect(
      countActiveFilters(
        filters({
          search: 'ticket',
          severities: ['critical', 'high'],
          categories: ['Persistence', 'Configuration'],
          dateRange: ['2026-07-17', '2026-07-18'],
        }),
      ),
    ).toBe(4)
  })

  it('turns date-only values into UTC boundaries independent of local offset', () => {
    const localMidnightInNegativeOffset = new Date('2026-07-18T00:00:00-07:00')
    expect(localMidnightInNegativeOffset.toISOString()).toContain('T07:00:00')
    expect(
      filterAlerts(
        alerts,
        filters({ dateRange: ['2026-07-18', '2026-07-18'] }),
      ),
    ).toEqual([alerts[1]])
  })
})
