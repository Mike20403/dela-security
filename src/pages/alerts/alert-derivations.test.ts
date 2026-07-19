import { describe, expect, it } from 'vitest'
import type { SecurityAlert } from '../../core/types/alerts'
import {
  buildSeverityTrend,
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

describe('buildSeverityTrend', () => {
  const referenceDate = new Date('2026-07-20T12:00:00.000Z')
  const alertOn = (
    id: string,
    detectedAt: string,
    severity: SecurityAlert['severity'],
  ) => ({ id, detectedAt, severity }) as SecurityAlert

  it('returns a 7-day window of zeroed buckets for empty input', () => {
    const trend = buildSeverityTrend([], referenceDate)
    expect(trend).toHaveLength(7)
    expect(trend[0]!.day).toBe('2026-07-14')
    expect(trend[6]!.day).toBe('2026-07-20')
    for (const bucket of trend) {
      expect(bucket).toEqual({
        day: bucket.day,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      })
    }
  })

  it('counts a single alert on a single day', () => {
    const trend = buildSeverityTrend(
      [alertOn('1', '2026-07-20T08:00:00.000Z', 'critical')],
      referenceDate,
    )
    expect(trend[6]).toEqual({
      day: '2026-07-20',
      critical: 1,
      high: 0,
      medium: 0,
      low: 0,
    })
  })

  it('buckets multiple severities on the same day independently', () => {
    const trend = buildSeverityTrend(
      [
        alertOn('1', '2026-07-19T01:00:00.000Z', 'critical'),
        alertOn('2', '2026-07-19T02:00:00.000Z', 'critical'),
        alertOn('3', '2026-07-19T03:00:00.000Z', 'high'),
        alertOn('4', '2026-07-19T04:00:00.000Z', 'low'),
      ],
      referenceDate,
    )
    expect(trend[5]).toEqual({
      day: '2026-07-19',
      critical: 2,
      high: 1,
      medium: 0,
      low: 1,
    })
  })

  it('excludes alerts outside the 7-day window', () => {
    const trend = buildSeverityTrend(
      [
        alertOn('1', '2026-07-13T23:59:00.000Z', 'critical'), // 8 days ago, excluded
        alertOn('2', '2026-07-21T00:00:00.000Z', 'critical'), // future, excluded
        alertOn('3', '2026-07-14T00:00:00.000Z', 'high'), // exactly 7 days ago, included
      ],
      referenceDate,
    )
    const totals = trend.reduce(
      (sum, bucket) => sum + bucket.critical + bucket.high,
      0,
    )
    expect(totals).toBe(1)
    expect(trend[0]).toEqual({
      day: '2026-07-14',
      critical: 0,
      high: 1,
      medium: 0,
      low: 0,
    })
  })
})
