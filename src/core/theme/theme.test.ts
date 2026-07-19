import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { antdTheme } from './antd-theme.ts'
import { referenceTokens } from './internal/reference-tokens.ts'
import * as themeExports from './tokens.ts'
import { publicSystemCssVariables, systemTokens } from './tokens.ts'

const readStyle = (name: string) =>
  readFileSync(`${process.cwd()}/src/styles/${name}`, 'utf8')

const leafValues = (value: unknown): Array<string | number> => {
  if (typeof value === 'string' || typeof value === 'number') return [value]
  if (!value || typeof value !== 'object') return []

  return Object.values(value).flatMap(leafValues)
}

const hexLuminance = (hex: string) => {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )
  return 0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!
}

const contrast = (foreground: string, background: string) => {
  const [lighter, darker] = [
    hexLuminance(foreground),
    hexLuminance(background),
  ].sort((a, b) => b - a)
  return (lighter! + 0.05) / (darker! + 0.05)
}

describe('product token contracts', () => {
  it('exports only canonical public contracts', () => {
    expect(Object.keys(themeExports).sort()).toEqual([
      'publicSystemCssVariables',
      'systemTokens',
    ])

    const source = readFileSync(
      `${process.cwd()}/src/core/theme/tokens.ts`,
      'utf8',
    )
    expect(source).not.toMatch(
      /legacyAlertTokenAdapter|legacyCssVariables|cssVariables|applyCssVariables|primitive|severity|status/,
    )
  })

  it('defines exact reference and system layers', () => {
    expect(Object.keys(referenceTokens)).toEqual([
      'color',
      'spacing',
      'typography',
      'radius',
      'shadow',
      'motion',
      'breakpoint',
      'focus',
    ])
    expect(Object.keys(systemTokens)).toEqual([
      'color',
      'typography',
      'spacing',
      'radius',
      'elevation',
      'focus',
      'motion',
      'breakpoint',
    ])
    expect(Object.keys(systemTokens.color)).toEqual([
      'background',
      'foreground',
      'border',
      'action',
      'feedback',
      'selection',
    ])
  })

  it('resolves every system alias to a reference value', () => {
    const references = new Set(leafValues(referenceTokens))

    for (const value of leafValues(systemTokens)) {
      expect(references, `unknown reference alias: ${String(value)}`).toContain(
        value,
      )
    }
  })

  it('keeps alert domain names out of canonical core layers', () => {
    const keys = (value: unknown): string[] =>
      value && typeof value === 'object'
        ? Object.entries(value).flatMap(([key, child]) => [key, ...keys(child)])
        : []

    expect(keys({ systemTokens, publicSystemCssVariables })).not.toEqual(
      expect.arrayContaining(['severity', 'status']),
    )
    expect(themeExports).not.toHaveProperty('tokens')
    expect(systemTokens).not.toHaveProperty('primitive')
    expect(Object.keys(systemTokens.color.feedback)).toEqual([
      'info',
      'success',
      'warning',
      'danger',
      'caution',
      'neutral',
    ])
    for (const feedback of Object.values(systemTokens.color.feedback)) {
      expect(Object.keys(feedback)).toEqual([
        'foreground',
        'background',
        'border',
      ])
    }
  })

  it('uses insertion-ready numeric spacing and radius scales', () => {
    expect(Object.keys(referenceTokens.spacing)).toEqual([
      '0',
      '1',
      '2',
      '3',
      '4',
      '6',
      '8',
    ])
    expect(Object.keys(referenceTokens.radius)).toEqual(['0', '1', '2', '3'])
    expect(systemTokens.spacing).toMatchObject({
      compact: referenceTokens.spacing[1],
      default: referenceTokens.spacing[4],
      spacious: referenceTokens.spacing[6],
    })
  })

  it('maps every public CSS name to its intended system role', () => {
    const expected = {
      '--dela-sys-color-background-canvas':
        systemTokens.color.background.canvas,
      '--dela-sys-color-background-surface':
        systemTokens.color.background.surface,
      '--dela-sys-color-background-subtle':
        systemTokens.color.background.subtle,
      '--dela-sys-color-background-elevated':
        systemTokens.color.background.elevated,
      '--dela-sys-color-foreground-default':
        systemTokens.color.foreground.default,
      '--dela-sys-color-foreground-muted': systemTokens.color.foreground.muted,
      '--dela-sys-color-foreground-subtle':
        systemTokens.color.foreground.subtle,
      '--dela-sys-color-foreground-inverse':
        systemTokens.color.foreground.inverse,
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
      '--dela-sys-color-feedback-caution-foreground':
        systemTokens.color.feedback.caution.foreground,
      '--dela-sys-color-feedback-caution-background':
        systemTokens.color.feedback.caution.background,
      '--dela-sys-color-feedback-caution-border':
        systemTokens.color.feedback.caution.border,
      '--dela-sys-color-feedback-neutral-foreground':
        systemTokens.color.feedback.neutral.foreground,
      '--dela-sys-color-feedback-neutral-background':
        systemTokens.color.feedback.neutral.background,
      '--dela-sys-color-feedback-neutral-border':
        systemTokens.color.feedback.neutral.border,
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
      '--dela-sys-typography-heading-size':
        systemTokens.typography.heading.size,
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

    expect(publicSystemCssVariables).toEqual(expected)
    expect(Object.keys(publicSystemCssVariables).join(' ')).not.toMatch(
      /slate|blue|red|amber|green|severity|status/,
    )
  })

  it.each([
    [
      'primary text on canvas',
      systemTokens.color.foreground.default,
      systemTokens.color.background.canvas,
      4.5,
    ],
    [
      'secondary text on canvas',
      systemTokens.color.foreground.muted,
      systemTokens.color.background.canvas,
      4.5,
    ],
    [
      'inverse text on action',
      systemTokens.color.foreground.inverse,
      systemTokens.color.action.primary.background,
      4.5,
    ],
    ...Object.entries(systemTokens.color.feedback).map(([name, feedback]) => [
      `${name} feedback`,
      feedback.foreground,
      feedback.background,
      4.5,
    ]),
    ...Object.entries(systemTokens.color.background).map(([name, surface]) => [
      `focus ring on ${name} surface`,
      systemTokens.focus.ring,
      surface,
      3,
    ]),
  ])('%s meets WCAG contrast', (_name, foreground, background, threshold) => {
    expect(
      contrast(String(foreground), String(background)),
    ).toBeGreaterThanOrEqual(Number(threshold))
  })
})

describe('Ant Design theme', () => {
  it('references canonical tokens and enables stable CSS variables', () => {
    expect(antdTheme.cssVar).toEqual({ key: 'dela-security', prefix: 'dela' })
    expect(antdTheme.token).toMatchObject({
      colorPrimary: systemTokens.color.action.primary.background,
      colorBgLayout: systemTokens.color.background.canvas,
      colorBgContainer: systemTokens.color.background.surface,
      colorText: systemTokens.color.foreground.default,
      colorTextSecondary: systemTokens.color.foreground.muted,
      colorBorder: systemTokens.color.border.default,
      colorError: systemTokens.color.feedback.danger.foreground,
      colorWarning: systemTokens.color.feedback.warning.foreground,
      colorSuccess: systemTokens.color.feedback.success.foreground,
    })
  })
})

describe('CSS integration', () => {
  it('defines every public system CSS variable with its exact system value', () => {
    const tokenCss = readStyle('tokens.css').replace(/\s+/g, ' ')

    for (const [name, value] of Object.entries(publicSystemCssVariables)) {
      expect(tokenCss, `${name} missing or mismatched`).toContain(
        `${name}: ${String(value).replace(/\s+/g, ' ')}`,
      )
    }
  })

  it.each([
    ['--spacing-xs', '--dela-sys-spacing-compact'],
    ['--spacing-sm', '--dela-sys-spacing-tight'],
    ['--spacing-md', '--dela-sys-spacing-default'],
    ['--spacing-lg', '--dela-sys-spacing-spacious'],
    ['--text-sm', '--dela-sys-typography-body-size'],
    ['--text-xl', '--dela-sys-typography-heading-size'],
    ['--font-weight-semibold', '--dela-sys-typography-heading-weight'],
    ['--leading-normal', '--dela-sys-typography-body-line-height'],
    ['--radius-sm', '--dela-sys-radius-small'],
    ['--radius-md', '--dela-sys-radius-medium'],
    ['--radius-lg', '--dela-sys-radius-large'],
    ['--shadow-sm', '--dela-sys-elevation-surface'],
    ['--shadow-md', '--dela-sys-elevation-overlay'],
    ['--ease-standard', '--dela-sys-motion-easing-standard'],
    ['--color-background-surface', '--dela-sys-color-background-surface'],
    ['--color-background-subtle', '--dela-sys-color-background-subtle'],
    ['--color-foreground-default', '--dela-sys-color-foreground-default'],
    ['--color-foreground-muted', '--dela-sys-color-foreground-muted'],
    ['--color-foreground-inverse', '--dela-sys-color-foreground-inverse'],
    ['--color-border-default', '--dela-sys-color-border-default'],
    ['--color-border-subtle', '--dela-sys-color-border-subtle'],
    ['--color-action-primary', '--dela-sys-color-action-primary-background'],
    ['--color-action-hover', '--dela-sys-color-action-primary-hover'],
    ['--color-action-subtle', '--dela-sys-color-selection-background'],
    ['--color-focus-ring', '--dela-sys-color-focus-ring'],
    ['--color-focus-offset', '--dela-sys-color-focus-offset'],
  ])('exposes Tailwind namespace %s', (tailwindName, delaName) => {
    expect(readStyle('tokens.css')).toContain(
      `${tailwindName}: var(${delaName})`,
    )
  })

  it.each(Object.entries(systemTokens.breakpoint))(
    'exposes build-time Tailwind breakpoint %s',
    (name, value) => {
      expect(readStyle('tokens.css')).toContain(
        `--breakpoint-${name}: ${value}`,
      )
    },
  )

  it('defines compatible layers, focus visibility, and reduced motion', () => {
    const globalCss = readStyle('global.css')

    expect(globalCss).toContain(
      '@layer theme, base, antd, components, utilities',
    )
    expect(globalCss).toContain(':focus-visible')
    expect(globalCss).toContain(
      'outline-offset: var(--dela-sys-focus-offset-width)',
    )
    expect(globalCss).toContain('@media (prefers-reduced-motion: reduce)')
    expect(globalCss).not.toMatch(/\.ant-[\w-]+/)
  })

  it('never uses legacy --app-* variable names', () => {
    expect(readStyle('tokens.css')).not.toMatch(/--app-/)
    expect(readStyle('global.css')).not.toMatch(/--app-/)
  })

  it('exposes alert severity/status classes as static CSS sourced from systemTokens feedback roles', () => {
    const tokenCss = readStyle('tokens.css')

    expect(tokenCss).not.toMatch(/dela-legacy-alert/)

    for (const name of ['critical', 'high', 'medium', 'low']) {
      expect(tokenCss).toMatch(new RegExp(`@utility text-severity-${name} \\{`))
      expect(tokenCss).toMatch(
        new RegExp(`@utility bg-severity-surface-${name} \\{`),
      )
      expect(tokenCss).toMatch(
        new RegExp(`@utility border-t-severity-${name} \\{`),
      )
    }

    for (const name of ['open', 'in_review', 'resolved', 'suppressed']) {
      expect(tokenCss).toMatch(new RegExp(`@utility text-status-${name} \\{`))
      expect(tokenCss).toMatch(
        new RegExp(`@utility bg-status-surface-${name} \\{`),
      )
    }
  })

  it.each([
    ['critical', systemTokens.color.feedback.danger],
    ['high', systemTokens.color.feedback.caution],
    ['medium', systemTokens.color.feedback.warning],
    ['low', systemTokens.color.feedback.neutral],
  ] as const)(
    '%s severity foreground/background pair meets WCAG contrast',
    (_name, feedback) => {
      expect(
        contrast(feedback.foreground, feedback.background),
      ).toBeGreaterThanOrEqual(4.5)
    },
  )

  it.each([
    ['open', systemTokens.color.feedback.info],
    ['in_review', systemTokens.color.feedback.warning],
    ['resolved', systemTokens.color.feedback.success],
    ['suppressed', systemTokens.color.feedback.neutral],
  ] as const)(
    '%s status foreground/background pair meets WCAG contrast',
    (_name, feedback) => {
      expect(
        contrast(feedback.foreground, feedback.background),
      ).toBeGreaterThanOrEqual(4.5)
    },
  )
})

describe('runtime token application removal', () => {
  it('does not import legacy runtime CSS injection from main.tsx', () => {
    const main = readFileSync(`${process.cwd()}/src/main.tsx`, 'utf8')
    expect(main).not.toMatch(/applyCssVariables|legacy-theme-compat/)
  })
})
