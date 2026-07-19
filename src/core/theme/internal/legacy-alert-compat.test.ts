import { describe, expect, it } from 'vitest'
import { legacyAlertTokenAdapter } from './legacy-alert-compat.ts'

describe('legacy alert compatibility', () => {
  it('keeps exact alert compatibility values stable (Phase 3 will remove this)', () => {
    expect(legacyAlertTokenAdapter).toEqual({
      severity: {
        critical: '#b91c1c',
        high: '#c2410c',
        medium: '#a16207',
        low: '#0e7490',
      },
      severitySurface: {
        critical: '#fef2f2',
        high: '#fff7ed',
        medium: '#fffbeb',
        low: '#ecfeff',
      },
      status: {
        new: '#2563eb',
        investigating: '#a16207',
        resolved: '#15803d',
        dismissed: '#475569',
      },
      statusSurface: {
        new: '#eff6ff',
        investigating: '#fffbeb',
        resolved: '#f0fdf4',
        dismissed: '#f1f5f9',
      },
    })
  })
})
