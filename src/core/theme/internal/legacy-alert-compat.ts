import { referenceTokens } from './reference-tokens.ts'

// Phase 3 will replace this with typed alert presentation metadata. Keep until then.
const { color } = referenceTokens

export const legacyAlertTokenAdapter = {
  severity: {
    critical: color.red[700],
    high: color.orange[700],
    medium: color.amber[700],
    low: color.cyan[700],
  },
  severitySurface: {
    critical: color.red[50],
    high: color.orange[50],
    medium: color.amber[50],
    low: color.cyan[50],
  },
  status: {
    new: color.blue[600],
    investigating: color.amber[700],
    resolved: color.green[700],
    dismissed: color.neutral[500],
  },
  statusSurface: {
    new: color.blue[50],
    investigating: color.amber[50],
    resolved: color.green[50],
    dismissed: color.neutral[50],
  },
} as const
