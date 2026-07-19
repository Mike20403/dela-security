import { systemTokens } from '../tokens.ts'
import { referenceTokens } from './reference-tokens.ts'

// Migration-only compatibility. Remove runtime CSS in Phase 2 and alert mappings in Phase 3.
const { color, typography, spacing, radius, shadow } = referenceTokens

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

export const legacyCssVariables = {
  '--app-color-surface-canvas': systemTokens.color.background.canvas,
  '--app-color-surface-container': systemTokens.color.background.surface,
  '--app-color-surface-muted': systemTokens.color.background.subtle,
  '--app-color-surface-elevated': systemTokens.color.background.elevated,
  '--app-color-text-primary': systemTokens.color.foreground.default,
  '--app-color-text-strong': systemTokens.color.foreground.subtle,
  '--app-color-text-secondary': systemTokens.color.foreground.muted,
  '--app-color-text-inverse': systemTokens.color.foreground.inverse,
  '--app-color-text-disabled': systemTokens.color.foreground.disabled,
  '--app-color-border-default': systemTokens.color.border.default,
  '--app-color-border-subtle': systemTokens.color.border.subtle,
  '--app-color-border-strong': systemTokens.color.border.strong,
  '--app-color-focus-ring': systemTokens.focus.ring,
  '--app-color-focus-offset': systemTokens.focus.offsetColor,
  '--app-color-action-primary': systemTokens.color.action.primary.background,
  '--app-color-action-hover': systemTokens.color.action.primary.hover,
  '--app-color-action-subtle': systemTokens.color.selection.background,
  '--app-color-severity-critical': legacyAlertTokenAdapter.severity.critical,
  '--app-color-severity-high': legacyAlertTokenAdapter.severity.high,
  '--app-color-severity-medium': legacyAlertTokenAdapter.severity.medium,
  '--app-color-severity-low': legacyAlertTokenAdapter.severity.low,
  '--app-color-severity-surface-critical':
    legacyAlertTokenAdapter.severitySurface.critical,
  '--app-color-severity-surface-high':
    legacyAlertTokenAdapter.severitySurface.high,
  '--app-color-severity-surface-medium':
    legacyAlertTokenAdapter.severitySurface.medium,
  '--app-color-severity-surface-low':
    legacyAlertTokenAdapter.severitySurface.low,
  '--app-color-status-new': legacyAlertTokenAdapter.status.new,
  '--app-color-status-investigating':
    legacyAlertTokenAdapter.status.investigating,
  '--app-color-status-resolved': legacyAlertTokenAdapter.status.resolved,
  '--app-color-status-dismissed': legacyAlertTokenAdapter.status.dismissed,
  '--app-color-status-surface-new': legacyAlertTokenAdapter.statusSurface.new,
  '--app-color-status-surface-investigating':
    legacyAlertTokenAdapter.statusSurface.investigating,
  '--app-color-status-surface-resolved':
    legacyAlertTokenAdapter.statusSurface.resolved,
  '--app-color-status-surface-dismissed':
    legacyAlertTokenAdapter.statusSurface.dismissed,
  '--app-font-sans': typography.family.sans,
  '--app-font-mono': typography.family.mono,
  '--app-font-size-xs': typography.size[1],
  '--app-font-size-sm': typography.size[2],
  '--app-font-size-base': typography.size[3],
  '--app-font-size-lg': typography.size[4],
  '--app-font-size-xl': typography.size[5],
  '--app-font-weight-normal': typography.weight.regular,
  '--app-font-weight-medium': typography.weight.medium,
  '--app-font-weight-semibold': typography.weight.semibold,
  '--app-line-height-normal': typography.lineHeight.normal,
  '--app-spacing-xs': spacing[1],
  '--app-spacing-sm': spacing[2],
  '--app-spacing-md': spacing[4],
  '--app-spacing-lg': spacing[6],
  '--app-spacing-xl': spacing[8],
  '--app-radius-sm': radius[1],
  '--app-radius-md': radius[2],
  '--app-radius-lg': radius[3],
  '--app-shadow-sm': shadow[1],
  '--app-shadow-md': shadow[2],
  '--app-motion-duration-fast': systemTokens.motion.fast,
  '--app-motion-duration-normal': systemTokens.motion.normal,
  '--app-motion-ease': systemTokens.motion.standard,
  '--app-breakpoint-sm': systemTokens.breakpoint.sm,
  '--app-breakpoint-md': systemTokens.breakpoint.md,
  '--app-breakpoint-lg': systemTokens.breakpoint.lg,
  '--app-breakpoint-xl': systemTokens.breakpoint.xl,
  '--app-focus-offset': systemTokens.focus.offset,
} as const

export const cssVariables = legacyCssVariables

export function applyCssVariables(root?: HTMLElement) {
  root ??=
    typeof document === 'undefined' ? undefined : document.documentElement
  if (!root) return

  for (const [name, value] of Object.entries(cssVariables)) {
    root.style.setProperty(name, String(value))
  }
}
