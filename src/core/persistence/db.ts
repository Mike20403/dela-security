import Dexie, { type EntityTable } from 'dexie'
import type { AlertUpdate } from '../../pages/alerts/api/alerts-repository'

// Only status-change fields survive refresh; not the full alert dataset.
export interface AlertOverrideRecord extends AlertUpdate {
  id: string
}

export class AlertOverridesDb extends Dexie {
  alertOverrides!: EntityTable<AlertOverrideRecord, 'id'>

  constructor() {
    super('dela-security-alert-overrides')
    this.version(1).stores({ alertOverrides: 'id' })
  }
}

export const alertOverridesDb = new AlertOverridesDb()

export async function putAlertOverride(id: string, changes: AlertUpdate) {
  const existing = await alertOverridesDb.alertOverrides.get(id)
  await alertOverridesDb.alertOverrides.put({ ...existing, ...changes, id })
}

export async function getAllAlertOverrides(): Promise<
  Record<string, AlertUpdate>
> {
  const records = await alertOverridesDb.alertOverrides.toArray()
  return Object.fromEntries(records.map(({ id, ...changes }) => [id, changes]))
}
