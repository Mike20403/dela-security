import type { AlertStatus, SecurityAlert } from '../../core/types/alerts'

export type AlertTabId = 'all' | AlertStatus

export function summarizeAlerts(alerts: readonly SecurityAlert[]) {
  return alerts.reduce(
    (summary, alert) => {
      summary.total++
      if (alert.severity === 'critical') summary.critical++
      else if (alert.severity === 'high') summary.high++
      else summary.mediumLow++
      return summary
    },
    { total: 0, critical: 0, high: 0, mediumLow: 0 },
  )
}

export function countAlertsByStatus(alerts: readonly SecurityAlert[]) {
  return alerts.reduce(
    (counts, alert) => {
      counts.all++
      counts[alert.status]++
      return counts
    },
    { all: 0, open: 0, in_review: 0, resolved: 0, suppressed: 0 },
  )
}

export function filterAlertsByTab(
  alerts: readonly SecurityAlert[],
  tab: AlertTabId,
) {
  return tab === 'all'
    ? [...alerts]
    : alerts.filter((alert) => alert.status === tab)
}

const detectedAtFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
})

export interface SeverityTrendBucket {
  day: string
  critical: number
  high: number
  medium: number
  low: number
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

function toUtcDayKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

/** Buckets alerts by UTC day for the trailing 7-day window (inclusive of `reference`'s day). */
export function buildSeverityTrend(
  alerts: readonly SecurityAlert[],
  reference: Date = new Date(),
): SeverityTrendBucket[] {
  const referenceDayStart = Date.UTC(
    reference.getUTCFullYear(),
    reference.getUTCMonth(),
    reference.getUTCDate(),
  )
  const windowStart = referenceDayStart - 6 * MS_PER_DAY

  const buckets = new Map<string, SeverityTrendBucket>()
  for (let offset = 0; offset < 7; offset++) {
    const day = toUtcDayKey(new Date(windowStart + offset * MS_PER_DAY))
    buckets.set(day, { day, critical: 0, high: 0, medium: 0, low: 0 })
  }

  for (const alert of alerts) {
    const detected = new Date(alert.detectedAt)
    if (Number.isNaN(detected.getTime())) continue
    const detectedDayStart = Date.UTC(
      detected.getUTCFullYear(),
      detected.getUTCMonth(),
      detected.getUTCDate(),
    )
    if (detectedDayStart < windowStart || detectedDayStart > referenceDayStart)
      continue
    const bucket = buckets.get(toUtcDayKey(new Date(detectedDayStart)))
    if (bucket) bucket[alert.severity]++
  }

  return [...buckets.values()]
}

export function formatDetectedAt(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T/.exec(value)
  if (!match) return '—'
  const [, yearText, monthText, dayText] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)
  const canonical = new Date(Date.UTC(year, month - 1, day))
  if (
    canonical.getUTCFullYear() !== year ||
    canonical.getUTCMonth() !== month - 1 ||
    canonical.getUTCDate() !== day
  )
    return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : detectedAtFormatter.format(date)
}
