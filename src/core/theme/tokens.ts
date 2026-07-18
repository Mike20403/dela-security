type TokenTree = { readonly [key: string]: string | number | TokenTree }

const primitiveTokens = {
  palette: {
    white: '#ffffff',
    slate25: '#f8fafc',
    slate50: '#f1f5f9',
    slate100: '#e2e8f0',
    slate200: '#cbd5e1',
    slate300: '#94a3b8',
    slate500: '#475569',
    slate700: '#1e293b',
    slate900: '#0f172a',
    blue50: '#eff6ff',
    blue600: '#2563eb',
    blue700: '#1d4ed8',
    red50: '#fef2f2',
    red700: '#b91c1c',
    orange50: '#fff7ed',
    orange700: '#c2410c',
    amber50: '#fffbeb',
    amber700: '#a16207',
    cyan50: '#ecfeff',
    cyan700: '#0e7490',
    green50: '#f0fdf4',
    green700: '#15803d',
  },
  typography: {
    sans: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    weightNormal: 400,
    weightMedium: 500,
    weightSemibold: 600,
    leading: 1.5,
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: { sm: '0.25rem', md: '0.375rem', lg: '0.5rem' },
  elevation: {
    sm: '0 1px 2px rgb(15 23 42 / 0.06)',
    md: '0 4px 12px rgb(15 23 42 / 0.08)',
  },
  motion: {
    fast: '100ms',
    normal: '180ms',
    ease: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  breakpoint: { sm: '40rem', md: '48rem', lg: '64rem', xl: '80rem' },
  focus: { offset: '2px' },
} as const satisfies TokenTree

export const tokens = {
  primitive: primitiveTokens,
  semantic: {
    surface: {
      canvas: primitiveTokens.palette.slate25,
      container: primitiveTokens.palette.white,
      muted: primitiveTokens.palette.slate50,
      elevated: primitiveTokens.palette.white,
    },
    text: {
      primary: primitiveTokens.palette.slate900,
      strong: primitiveTokens.palette.slate700,
      secondary: primitiveTokens.palette.slate500,
      inverse: primitiveTokens.palette.white,
      disabled: primitiveTokens.palette.slate300,
    },
    border: {
      default: primitiveTokens.palette.slate200,
      subtle: primitiveTokens.palette.slate100,
      strong: primitiveTokens.palette.slate300,
    },
    focus: {
      ring: primitiveTokens.palette.blue600,
      offset: primitiveTokens.palette.white,
    },
    action: {
      primary: primitiveTokens.palette.blue600,
      hover: primitiveTokens.palette.blue700,
      subtle: primitiveTokens.palette.blue50,
    },
    severity: {
      critical: primitiveTokens.palette.red700,
      high: primitiveTokens.palette.orange700,
      medium: primitiveTokens.palette.amber700,
      low: primitiveTokens.palette.cyan700,
    },
    severitySurface: {
      critical: primitiveTokens.palette.red50,
      high: primitiveTokens.palette.orange50,
      medium: primitiveTokens.palette.amber50,
      low: primitiveTokens.palette.cyan50,
    },
    status: {
      new: primitiveTokens.palette.blue600,
      investigating: primitiveTokens.palette.amber700,
      resolved: primitiveTokens.palette.green700,
      dismissed: primitiveTokens.palette.slate500,
    },
    statusSurface: {
      new: primitiveTokens.palette.blue50,
      investigating: primitiveTokens.palette.amber50,
      resolved: primitiveTokens.palette.green50,
      dismissed: primitiveTokens.palette.slate50,
    },
  },
} as const satisfies {
  readonly primitive: TokenTree
  readonly semantic: TokenTree
}

export const cssVariables = {
  '--app-color-surface-canvas': tokens.semantic.surface.canvas,
  '--app-color-surface-container': tokens.semantic.surface.container,
  '--app-color-surface-muted': tokens.semantic.surface.muted,
  '--app-color-surface-elevated': tokens.semantic.surface.elevated,
  '--app-color-text-primary': tokens.semantic.text.primary,
  '--app-color-text-strong': tokens.semantic.text.strong,
  '--app-color-text-secondary': tokens.semantic.text.secondary,
  '--app-color-text-inverse': tokens.semantic.text.inverse,
  '--app-color-text-disabled': tokens.semantic.text.disabled,
  '--app-color-border-default': tokens.semantic.border.default,
  '--app-color-border-subtle': tokens.semantic.border.subtle,
  '--app-color-border-strong': tokens.semantic.border.strong,
  '--app-color-focus-ring': tokens.semantic.focus.ring,
  '--app-color-focus-offset': tokens.semantic.focus.offset,
  '--app-color-action-primary': tokens.semantic.action.primary,
  '--app-color-action-hover': tokens.semantic.action.hover,
  '--app-color-action-subtle': tokens.semantic.action.subtle,
  '--app-color-severity-critical': tokens.semantic.severity.critical,
  '--app-color-severity-high': tokens.semantic.severity.high,
  '--app-color-severity-medium': tokens.semantic.severity.medium,
  '--app-color-severity-low': tokens.semantic.severity.low,
  '--app-color-severity-surface-critical':
    tokens.semantic.severitySurface.critical,
  '--app-color-severity-surface-high': tokens.semantic.severitySurface.high,
  '--app-color-severity-surface-medium': tokens.semantic.severitySurface.medium,
  '--app-color-severity-surface-low': tokens.semantic.severitySurface.low,
  '--app-color-status-new': tokens.semantic.status.new,
  '--app-color-status-investigating': tokens.semantic.status.investigating,
  '--app-color-status-resolved': tokens.semantic.status.resolved,
  '--app-color-status-dismissed': tokens.semantic.status.dismissed,
  '--app-color-status-surface-new': tokens.semantic.statusSurface.new,
  '--app-color-status-surface-investigating':
    tokens.semantic.statusSurface.investigating,
  '--app-color-status-surface-resolved': tokens.semantic.statusSurface.resolved,
  '--app-color-status-surface-dismissed':
    tokens.semantic.statusSurface.dismissed,
  '--app-font-sans': tokens.primitive.typography.sans,
  '--app-font-mono': tokens.primitive.typography.mono,
  '--app-font-size-xs': tokens.primitive.typography.xs,
  '--app-font-size-sm': tokens.primitive.typography.sm,
  '--app-font-size-base': tokens.primitive.typography.base,
  '--app-font-size-lg': tokens.primitive.typography.lg,
  '--app-font-size-xl': tokens.primitive.typography.xl,
  '--app-font-weight-normal': tokens.primitive.typography.weightNormal,
  '--app-font-weight-medium': tokens.primitive.typography.weightMedium,
  '--app-font-weight-semibold': tokens.primitive.typography.weightSemibold,
  '--app-line-height-normal': tokens.primitive.typography.leading,
  '--app-spacing-xs': tokens.primitive.spacing.xs,
  '--app-spacing-sm': tokens.primitive.spacing.sm,
  '--app-spacing-md': tokens.primitive.spacing.md,
  '--app-spacing-lg': tokens.primitive.spacing.lg,
  '--app-spacing-xl': tokens.primitive.spacing.xl,
  '--app-radius-sm': tokens.primitive.radius.sm,
  '--app-radius-md': tokens.primitive.radius.md,
  '--app-radius-lg': tokens.primitive.radius.lg,
  '--app-shadow-sm': tokens.primitive.elevation.sm,
  '--app-shadow-md': tokens.primitive.elevation.md,
  '--app-motion-duration-fast': tokens.primitive.motion.fast,
  '--app-motion-duration-normal': tokens.primitive.motion.normal,
  '--app-motion-ease': tokens.primitive.motion.ease,
  '--app-breakpoint-sm': tokens.primitive.breakpoint.sm,
  '--app-breakpoint-md': tokens.primitive.breakpoint.md,
  '--app-breakpoint-lg': tokens.primitive.breakpoint.lg,
  '--app-breakpoint-xl': tokens.primitive.breakpoint.xl,
  '--app-focus-offset': tokens.primitive.focus.offset,
} as const

export function applyCssVariables(root?: HTMLElement) {
  root ??=
    typeof document === 'undefined' ? undefined : document.documentElement
  if (!root) return

  for (const [name, value] of Object.entries(cssVariables)) {
    root.style.setProperty(name, String(value))
  }
}
