import type { AlertSeverity, AlertStatus } from '../../core/types/alerts'

interface Presentation<T extends string> {
  readonly label: string
  readonly order: number
  readonly className: string
  readonly textClassName: string
  readonly borderTopClassName: string
  readonly value: T
}

// Severity/status colors are static CSS utilities (text-severity-*, bg-severity-surface-*,
// border-t-severity-*, text-status-*, bg-status-surface-*) sourced from systemTokens feedback
// roles in tokens.css. This module only owns labels, order, and which class names apply.
export const severityPresentation: Record<
  AlertSeverity,
  Presentation<AlertSeverity>
> = {
  critical: {
    label: 'Critical',
    order: 0,
    className: 'text-severity-critical bg-severity-surface-critical',
    textClassName: 'text-severity-critical',
    borderTopClassName: 'border-t-severity-critical',
    value: 'critical',
  },
  high: {
    label: 'High',
    order: 1,
    className: 'text-severity-high bg-severity-surface-high',
    textClassName: 'text-severity-high',
    borderTopClassName: 'border-t-severity-high',
    value: 'high',
  },
  medium: {
    label: 'Medium',
    order: 2,
    className: 'text-severity-medium bg-severity-surface-medium',
    textClassName: 'text-severity-medium',
    borderTopClassName: 'border-t-severity-medium',
    value: 'medium',
  },
  low: {
    label: 'Low',
    order: 3,
    className: 'text-severity-low bg-severity-surface-low',
    textClassName: 'text-severity-low',
    borderTopClassName: 'border-t-severity-low',
    value: 'low',
  },
}

export const severityOrder: readonly AlertSeverity[] = [
  'critical',
  'high',
  'medium',
  'low',
]

export const severityOptions = severityOrder.map((severity) => ({
  label: severityPresentation[severity].label,
  value: severity,
}))

export const statusPresentation: Record<
  AlertStatus,
  Presentation<AlertStatus>
> = {
  open: {
    label: 'Open',
    order: 0,
    className: 'text-status-open bg-status-surface-open',
    textClassName: 'text-status-open',
    borderTopClassName: 'border-t-status-open',
    value: 'open',
  },
  in_review: {
    label: 'In Review',
    order: 1,
    className: 'text-status-in_review bg-status-surface-in_review',
    textClassName: 'text-status-in_review',
    borderTopClassName: 'border-t-status-in_review',
    value: 'in_review',
  },
  resolved: {
    label: 'Resolved',
    order: 2,
    className: 'text-status-resolved bg-status-surface-resolved',
    textClassName: 'text-status-resolved',
    borderTopClassName: 'border-t-status-resolved',
    value: 'resolved',
  },
  suppressed: {
    label: 'Suppressed',
    order: 3,
    className: 'text-status-suppressed bg-status-surface-suppressed',
    textClassName: 'text-status-suppressed',
    borderTopClassName: 'border-t-status-suppressed',
    value: 'suppressed',
  },
}

export const statusOrder: readonly AlertStatus[] = [
  'open',
  'in_review',
  'resolved',
  'suppressed',
]

export const statusOptions = statusOrder.map((status) => ({
  label: statusPresentation[status].label,
  value: status,
}))
