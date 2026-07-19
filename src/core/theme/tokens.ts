import { referenceTokens } from './internal/reference-tokens.ts'

type TokenTree = { readonly [key: string]: string | number | TokenTree }

const { color, typography, spacing, radius, shadow, motion } = referenceTokens

export const systemTokens = {
  color: {
    background: {
      canvas: color.neutral[25],
      surface: color.white,
      subtle: color.neutral[50],
      elevated: color.white,
    },
    foreground: {
      default: color.neutral[900],
      muted: color.neutral[500],
      subtle: color.neutral[700],
      inverse: color.white,
      disabled: color.neutral[300],
    },
    border: {
      default: color.neutral[200],
      subtle: color.neutral[100],
      strong: color.neutral[300],
      focus: color.blue[600],
    },
    action: {
      primary: {
        background: color.blue[600],
        foreground: color.white,
        hover: color.blue[700],
        pressed: color.blue[700],
        disabled: color.neutral[300],
      },
      secondary: {
        background: color.white,
        foreground: color.neutral[700],
        hover: color.neutral[50],
        pressed: color.neutral[100],
        disabled: color.neutral[300],
      },
    },
    feedback: {
      info: {
        foreground: color.blue[700],
        background: color.blue[50],
        border: color.blue[700],
      },
      success: {
        foreground: color.green[700],
        background: color.green[50],
        border: color.green[700],
      },
      warning: {
        foreground: color.amber[700],
        background: color.amber[50],
        border: color.amber[700],
      },
      danger: {
        foreground: color.red[700],
        background: color.red[50],
        border: color.red[700],
      },
    },
    selection: {
      background: color.blue[50],
      foreground: color.blue[700],
    },
  },
  typography: {
    body: {
      family: typography.family.sans,
      size: typography.size[2],
      weight: typography.weight.regular,
      lineHeight: typography.lineHeight.normal,
    },
    code: {
      family: typography.family.mono,
      size: typography.size[2],
      weight: typography.weight.regular,
      lineHeight: typography.lineHeight.normal,
    },
    heading: {
      family: typography.family.sans,
      size: typography.size[5],
      weight: typography.weight.semibold,
      lineHeight: typography.lineHeight.compact,
    },
  },
  spacing: {
    none: spacing[0],
    compact: spacing[1],
    tight: spacing[2],
    default: spacing[4],
    spacious: spacing[6],
  },
  radius: {
    none: radius[0],
    small: radius[1],
    medium: radius[2],
    large: radius[3],
  },
  elevation: { surface: shadow[1], overlay: shadow[2] },
  focus: {
    ring: color.blue[600],
    offsetColor: color.white,
    width: referenceTokens.focus.width,
    offset: referenceTokens.focus.offset,
  },
  motion: {
    fast: motion.duration.fast,
    normal: motion.duration.normal,
    standard: motion.easing.standard,
  },
  breakpoint: referenceTokens.breakpoint,
} as const satisfies TokenTree

export type SystemTokens = typeof systemTokens

// Public contract for Phase 2 CSS integration. Reference palette stays internal.
export const publicSystemCssVariables = {
  '--dela-sys-color-background-canvas': systemTokens.color.background.canvas,
  '--dela-sys-color-background-surface': systemTokens.color.background.surface,
  '--dela-sys-color-background-subtle': systemTokens.color.background.subtle,
  '--dela-sys-color-background-elevated':
    systemTokens.color.background.elevated,
  '--dela-sys-color-foreground-default': systemTokens.color.foreground.default,
  '--dela-sys-color-foreground-muted': systemTokens.color.foreground.muted,
  '--dela-sys-color-foreground-subtle': systemTokens.color.foreground.subtle,
  '--dela-sys-color-foreground-inverse': systemTokens.color.foreground.inverse,
  '--dela-sys-color-foreground-disabled':
    systemTokens.color.foreground.disabled,
  '--dela-sys-color-border-default': systemTokens.color.border.default,
  '--dela-sys-color-border-subtle': systemTokens.color.border.subtle,
  '--dela-sys-color-border-strong': systemTokens.color.border.strong,
  '--dela-sys-color-border-focus': systemTokens.color.border.focus,
  '--dela-sys-color-action-primary-background':
    systemTokens.color.action.primary.background,
  '--dela-sys-color-action-primary-foreground':
    systemTokens.color.action.primary.foreground,
  '--dela-sys-color-action-primary-hover':
    systemTokens.color.action.primary.hover,
  '--dela-sys-color-action-primary-pressed':
    systemTokens.color.action.primary.pressed,
  '--dela-sys-color-action-primary-disabled':
    systemTokens.color.action.primary.disabled,
  '--dela-sys-color-action-secondary-background':
    systemTokens.color.action.secondary.background,
  '--dela-sys-color-action-secondary-foreground':
    systemTokens.color.action.secondary.foreground,
  '--dela-sys-color-action-secondary-hover':
    systemTokens.color.action.secondary.hover,
  '--dela-sys-color-action-secondary-pressed':
    systemTokens.color.action.secondary.pressed,
  '--dela-sys-color-action-secondary-disabled':
    systemTokens.color.action.secondary.disabled,
  '--dela-sys-color-feedback-info-foreground':
    systemTokens.color.feedback.info.foreground,
  '--dela-sys-color-feedback-info-background':
    systemTokens.color.feedback.info.background,
  '--dela-sys-color-feedback-info-border':
    systemTokens.color.feedback.info.border,
  '--dela-sys-color-feedback-success-foreground':
    systemTokens.color.feedback.success.foreground,
  '--dela-sys-color-feedback-success-background':
    systemTokens.color.feedback.success.background,
  '--dela-sys-color-feedback-success-border':
    systemTokens.color.feedback.success.border,
  '--dela-sys-color-feedback-warning-foreground':
    systemTokens.color.feedback.warning.foreground,
  '--dela-sys-color-feedback-warning-background':
    systemTokens.color.feedback.warning.background,
  '--dela-sys-color-feedback-warning-border':
    systemTokens.color.feedback.warning.border,
  '--dela-sys-color-feedback-danger-foreground':
    systemTokens.color.feedback.danger.foreground,
  '--dela-sys-color-feedback-danger-background':
    systemTokens.color.feedback.danger.background,
  '--dela-sys-color-feedback-danger-border':
    systemTokens.color.feedback.danger.border,
  '--dela-sys-color-selection-background':
    systemTokens.color.selection.background,
  '--dela-sys-color-selection-foreground':
    systemTokens.color.selection.foreground,
  '--dela-sys-color-focus-ring': systemTokens.focus.ring,
  '--dela-sys-color-focus-offset': systemTokens.focus.offsetColor,
  '--dela-sys-typography-body-family': systemTokens.typography.body.family,
  '--dela-sys-typography-body-size': systemTokens.typography.body.size,
  '--dela-sys-typography-body-weight': systemTokens.typography.body.weight,
  '--dela-sys-typography-body-line-height':
    systemTokens.typography.body.lineHeight,
  '--dela-sys-typography-code-family': systemTokens.typography.code.family,
  '--dela-sys-typography-code-size': systemTokens.typography.code.size,
  '--dela-sys-typography-code-weight': systemTokens.typography.code.weight,
  '--dela-sys-typography-code-line-height':
    systemTokens.typography.code.lineHeight,
  '--dela-sys-typography-heading-family':
    systemTokens.typography.heading.family,
  '--dela-sys-typography-heading-size': systemTokens.typography.heading.size,
  '--dela-sys-typography-heading-weight':
    systemTokens.typography.heading.weight,
  '--dela-sys-typography-heading-line-height':
    systemTokens.typography.heading.lineHeight,
  '--dela-sys-spacing-none': systemTokens.spacing.none,
  '--dela-sys-spacing-compact': systemTokens.spacing.compact,
  '--dela-sys-spacing-tight': systemTokens.spacing.tight,
  '--dela-sys-spacing-default': systemTokens.spacing.default,
  '--dela-sys-spacing-spacious': systemTokens.spacing.spacious,
  '--dela-sys-radius-none': systemTokens.radius.none,
  '--dela-sys-radius-small': systemTokens.radius.small,
  '--dela-sys-radius-medium': systemTokens.radius.medium,
  '--dela-sys-radius-large': systemTokens.radius.large,
  '--dela-sys-elevation-surface': systemTokens.elevation.surface,
  '--dela-sys-elevation-overlay': systemTokens.elevation.overlay,
  '--dela-sys-focus-width': systemTokens.focus.width,
  '--dela-sys-focus-offset-width': systemTokens.focus.offset,
  '--dela-sys-motion-duration-fast': systemTokens.motion.fast,
  '--dela-sys-motion-duration-normal': systemTokens.motion.normal,
  '--dela-sys-motion-easing-standard': systemTokens.motion.standard,
} as const
