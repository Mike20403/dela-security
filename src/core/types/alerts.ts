export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'

export type AlertStatus = 'open' | 'in_review' | 'resolved' | 'suppressed'

export interface SecurityAlert {
  id: string
  title: string
  severity: AlertSeverity
  status: AlertStatus
  category: string
  affectedAsset: string
  domainController: string
  detectedAt: string
  description: string
  recommendedAction: string
  assignedTo?: string | undefined
}
