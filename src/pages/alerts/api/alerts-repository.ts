import type { AlertStatus, SecurityAlert } from '../../../core/types/alerts'

export interface AlertUpdate {
  status?: AlertStatus
  // Assign-only: omit to preserve assignment; API does not support clearing.
  assignedTo?: string
}

export interface AlertsRepository {
  list(): Promise<SecurityAlert[]>
  update(id: string, changes: AlertUpdate): Promise<SecurityAlert>
}
