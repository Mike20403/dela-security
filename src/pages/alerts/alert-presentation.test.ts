import { describe, expect, it } from 'vitest'
import { systemTokens } from '../../core/theme/tokens'
import type { AlertSeverity, AlertStatus } from '../../core/types/alerts'
import {
  severityOptions,
  severityOrder,
  severityPresentation,
  statusOptions,
  statusOrder,
  statusPresentation,
} from './alert-presentation'

const severities: readonly AlertSeverity[] = [
  'critical',
  'high',
  'medium',
  'low',
]
const statuses: readonly AlertStatus[] = [
  'open',
  'in_review',
  'resolved',
  'suppressed',
]

describe('severityPresentation', () => {
  it('is exhaustive over every AlertSeverity', () => {
    expect(Object.keys(severityPresentation).sort()).toEqual(
      [...severities].sort(),
    )
  })

  it('exposes exact labels', () => {
    expect(severityPresentation.critical.label).toBe('Critical')
    expect(severityPresentation.high.label).toBe('High')
    expect(severityPresentation.medium.label).toBe('Medium')
    expect(severityPresentation.low.label).toBe('Low')
  })

  it('exposes stable severity ordering, most severe first', () => {
    expect(severityOrder).toEqual(['critical', 'high', 'medium', 'low'])
    for (const [index, severity] of severityOrder.entries()) {
      expect(severityPresentation[severity].order).toBe(index)
    }
  })

  it('exposes classes sourced from the static severity utility names', () => {
    expect(severityPresentation.critical.className).toBe(
      'text-severity-critical bg-severity-surface-critical',
    )
    expect(severityPresentation.high.className).toBe(
      'text-severity-high bg-severity-surface-high',
    )
    expect(severityPresentation.medium.className).toBe(
      'text-severity-medium bg-severity-surface-medium',
    )
    expect(severityPresentation.low.className).toBe(
      'text-severity-low bg-severity-surface-low',
    )
    for (const severity of severities) {
      expect(severityPresentation[severity].borderTopClassName).toBe(
        `border-t-severity-${severity}`,
      )
      expect(severityPresentation[severity].textClassName).toBe(
        `text-severity-${severity}`,
      )
    }
  })

  it('derives select options in the same order with matching labels', () => {
    expect(severityOptions).toEqual(
      severityOrder.map((severity) => ({
        label: severityPresentation[severity].label,
        value: severity,
      })),
    )
  })

  it('assigns pairwise-distinct foreground and background colors to every severity', () => {
    const feedbackBySeverity = {
      critical: systemTokens.color.feedback.danger,
      high: systemTokens.color.feedback.caution,
      medium: systemTokens.color.feedback.warning,
      low: systemTokens.color.feedback.neutral,
    } as const

    const foregrounds = severities.map((s) => feedbackBySeverity[s].foreground)
    const backgrounds = severities.map((s) => feedbackBySeverity[s].background)

    expect(new Set(foregrounds).size).toBe(severities.length)
    expect(new Set(backgrounds).size).toBe(severities.length)
  })
})

describe('statusPresentation', () => {
  it('is exhaustive over every AlertStatus', () => {
    expect(Object.keys(statusPresentation).sort()).toEqual([...statuses].sort())
  })

  it('exposes exact labels', () => {
    expect(statusPresentation.open.label).toBe('Open')
    expect(statusPresentation.in_review.label).toBe('In Review')
    expect(statusPresentation.resolved.label).toBe('Resolved')
    expect(statusPresentation.suppressed.label).toBe('Suppressed')
  })

  it('exposes stable status ordering', () => {
    expect(statusOrder).toEqual(['open', 'in_review', 'resolved', 'suppressed'])
    for (const [index, status] of statusOrder.entries()) {
      expect(statusPresentation[status].order).toBe(index)
    }
  })

  it('exposes classes sourced from the static status utility names', () => {
    for (const status of statuses) {
      expect(statusPresentation[status].className).toBe(
        `text-status-${status} bg-status-surface-${status}`,
      )
    }
  })

  it('derives select options in the same order with matching labels', () => {
    expect(statusOptions).toEqual(
      statusOrder.map((status) => ({
        label: statusPresentation[status].label,
        value: status,
      })),
    )
  })
})
