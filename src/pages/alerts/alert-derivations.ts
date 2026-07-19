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
