import type { SecurityAlert } from '../../core/types/alerts'
import type { AlertFilters } from './alert-filter-schema'

export function filterAlerts(
  alerts: readonly SecurityAlert[],
  filters: AlertFilters,
): SecurityAlert[] {
  const search = filters.search.trim().toLocaleLowerCase()
  const start = filters.dateRange
    ? Date.parse(`${filters.dateRange[0]}T00:00:00.000Z`)
    : undefined
  const end = filters.dateRange
    ? Date.parse(`${filters.dateRange[1]}T23:59:59.999Z`)
    : undefined

  return alerts.filter((alert) => {
    const detectedAt = Date.parse(alert.detectedAt)
    return (
      (!search ||
        alert.title.toLocaleLowerCase().includes(search) ||
        alert.affectedAsset.toLocaleLowerCase().includes(search)) &&
      (!filters.severities.length ||
        filters.severities.includes(alert.severity)) &&
      (!filters.categories.length ||
        filters.categories.includes(alert.category)) &&
      (start === undefined ||
        end === undefined ||
        (!Number.isNaN(detectedAt) && detectedAt >= start && detectedAt <= end))
    )
  })
}

export function countActiveFilters(filters: AlertFilters): number {
  return (
    Number(Boolean(filters.search.trim())) +
    Number(filters.severities.length > 0) +
    Number(filters.categories.length > 0) +
    Number(filters.dateRange !== null)
  )
}
