import { describe, expect, it } from 'vitest'
import type { SecurityAlert } from '../../core/types/alerts'
import {
  countAlertsByStatus,
  filterAlertsByTab,
  formatDetectedAt,
  summarizeAlerts,
} from './alert-derivations'

const alerts = [
  { id: '1', severity: 'critical', status: 'open' },
  { id: '2', severity: 'high', status: 'in_review' },
  { id: '3', severity: 'medium', status: 'resolved' },
  { id: '4', severity: 'low', status: 'suppressed' },
] as SecurityAlert[]

describe('alert derivations', () => {
  it('summarizes visible records, combining medium and low', () => {
    expect(summarizeAlerts(alerts)).toEqual({
      total: 4,
      critical: 1,
      high: 1,
      mediumLow: 2,
    })
  })

  it('counts all statuses including suppressed and filters tabs without losing suppressed alerts from All', () => {
    expect(countAlertsByStatus(alerts)).toEqual({
      all: 4,
      open: 1,
      in_review: 1,
      resolved: 1,
      suppressed: 1,
    })
    expect(filterAlertsByTab(alerts, 'all')).toHaveLength(4)
    expect(filterAlertsByTab(alerts, 'open').map(({ id }) => id)).toEqual(['1'])
  })

  it('formats valid dates deterministically and safely falls back', () => {
    expect(formatDetectedAt('2026-07-18T12:30:00.000Z')).toBe(
      'Jul 18, 2026, 12:30 PM',
    )
    expect(formatDetectedAt('2026-07-18T14:30:00.000+02:00')).toBe(
      'Jul 18, 2026, 12:30 PM',
    )
    expect(formatDetectedAt('2026-02-30T12:30:00.000Z')).toBe('—')
    expect(formatDetectedAt('2026-07')).toBe('—')
    expect(formatDetectedAt('not-a-date')).toBe('—')
  })
})
