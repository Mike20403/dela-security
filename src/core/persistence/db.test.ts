import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import { alertOverridesDb, getAllAlertOverrides, putAlertOverride } from './db'

afterEach(async () => {
  await alertOverridesDb.alertOverrides.clear()
})

describe('alertOverridesDb', () => {
  it('persists an alert status override and reads it back', async () => {
    await putAlertOverride('alert-1', { status: 'resolved' })

    const overrides = await getAllAlertOverrides()

    expect(overrides).toEqual({ 'alert-1': { status: 'resolved' } })
  })

  it('merges subsequent updates for the same alert id', async () => {
    await putAlertOverride('alert-1', { status: 'in_review' })
    await putAlertOverride('alert-1', { assignedTo: 'Alex Morgan' })

    const overrides = await getAllAlertOverrides()

    expect(overrides).toEqual({
      'alert-1': { status: 'in_review', assignedTo: 'Alex Morgan' },
    })
  })
})
