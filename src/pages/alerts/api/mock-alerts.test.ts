import { describe, expect, it } from 'vitest'
import type {
  AlertSeverity,
  AlertStatus,
  SecurityAlert,
} from '../../../core/types/alerts'
import { mockAlerts } from './mock-alerts.ts'

const severities = new Set<AlertSeverity>(['critical', 'high', 'medium', 'low'])
const statuses = new Set<AlertStatus>([
  'open',
  'in_review',
  'resolved',
  'suppressed',
])

describe('mockAlerts', () => {
  it('contains at least 30 unique, complete, realistic records', () => {
    expect(mockAlerts.length).toBeGreaterThanOrEqual(30)
    expect(new Set(mockAlerts.map(({ id }: SecurityAlert) => id)).size).toBe(
      mockAlerts.length,
    )

    for (const alert of mockAlerts) {
      expect(alert.id).not.toBe('')
      expect(alert.title).not.toBe('')
      expect(alert.category).not.toBe('')
      expect(alert.affectedAsset).not.toBe('')
      expect(alert.domainController).not.toBe('')
      expect(alert.description).toMatch(/[^.!?]+[.!?](?:\s+[^.!?]+[.!?]){0,2}$/)
      expect(alert.recommendedAction).toMatch(
        /[^.!?]+[.!?](?:\s+[^.!?]+[.!?]){0,2}$/,
      )
      expect(Number.isNaN(Date.parse(alert.detectedAt))).toBe(false)
      expect(new Date(alert.detectedAt).toISOString()).toBe(alert.detectedAt)
      expect(severities.has(alert.severity)).toBe(true)
      expect(statuses.has(alert.status)).toBe(true)
    }
  })

  it('covers every assignment severity and status', () => {
    expect(
      new Set(mockAlerts.map(({ severity }: SecurityAlert) => severity)),
    ).toEqual(severities)
    expect(
      new Set(mockAlerts.map(({ status }: SecurityAlert) => status)),
    ).toEqual(statuses)
  })
})
