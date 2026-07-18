import { describe, expect, it } from 'vitest'
import { mockAlerts } from './mock-alerts.ts'
import { alertSchema, alertsSchema } from './alert-schema.ts'

describe('alert API schemas', () => {
  it('strictly validates the alert list while preserving ISO timestamps', () => {
    const alerts = alertsSchema.validateSync(mockAlerts, { strict: true })

    expect(alerts).toEqual(mockAlerts)
    expect(alerts[0]!.detectedAt).toBe(mockAlerts[0]!.detectedAt)
  })

  it.each([
    ['unknown key', { extra: true }],
    ['invalid severity', { severity: 'urgent' }],
    ['invalid status', { status: 'closed' }],
    ['empty required string', { title: '' }],
    ['invalid timestamp', { detectedAt: 'yesterday' }],
  ])('rejects %s', async (_name, change) => {
    await expect(
      alertSchema.validate({ ...mockAlerts[0], ...change }, { strict: true }),
    ).rejects.toBeDefined()
  })

  it('accepts optional nonempty assignment but deliberately rejects clearing', async () => {
    await expect(
      alertSchema.validate(
        { ...mockAlerts[0], assignedTo: 'Alex Morgan' },
        { strict: true },
      ),
    ).resolves.toMatchObject({ assignedTo: 'Alex Morgan' })
    await expect(
      alertSchema.validate(
        { ...mockAlerts[0], assignedTo: null },
        { strict: true },
      ),
    ).rejects.toBeDefined()
  })
})
