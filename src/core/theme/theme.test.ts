import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { antdTheme } from './antd-theme.ts'
import { applyCssVariables, cssVariables, tokens } from './tokens.ts'

const readStyle = (name: string) =>
  readFileSync(`${process.cwd()}/src/styles/${name}`, 'utf8')

const entries = (
  prefix: string,
  values: Readonly<Record<string, string | number>>,
) =>
  Object.entries(values).map(
    ([name, value]) => [`${prefix}${name}`, value] as const,
  )

const tokenMappingGroups = [
  entries('--app-color-surface-', tokens.semantic.surface),
  entries('--app-color-text-', tokens.semantic.text),
  entries('--app-color-border-', tokens.semantic.border),
  entries('--app-color-focus-', tokens.semantic.focus),
  entries('--app-color-action-', tokens.semantic.action),
  entries('--app-color-severity-', tokens.semantic.severity),
  entries('--app-color-severity-surface-', tokens.semantic.severitySurface),
  entries('--app-color-status-', tokens.semantic.status),
  entries('--app-color-status-surface-', tokens.semantic.statusSurface),
  entries('--app-font-', {
    sans: tokens.primitive.typography.sans,
    mono: tokens.primitive.typography.mono,
  }),
  entries('--app-font-size-', {
    xs: tokens.primitive.typography.xs,
    sm: tokens.primitive.typography.sm,
    base: tokens.primitive.typography.base,
    lg: tokens.primitive.typography.lg,
    xl: tokens.primitive.typography.xl,
  }),
  entries('--app-font-weight-', {
    normal: tokens.primitive.typography.weightNormal,
    medium: tokens.primitive.typography.weightMedium,
    semibold: tokens.primitive.typography.weightSemibold,
  }),
  [['--app-line-height-normal', tokens.primitive.typography.leading]],
  entries('--app-spacing-', tokens.primitive.spacing),
  entries('--app-radius-', tokens.primitive.radius),
  entries('--app-shadow-', tokens.primitive.elevation),
  entries('--app-motion-duration-', {
    fast: tokens.primitive.motion.fast,
    normal: tokens.primitive.motion.normal,
  }),
  [['--app-motion-ease', tokens.primitive.motion.ease]],
  entries('--app-breakpoint-', tokens.primitive.breakpoint),
  [['--app-focus-offset', tokens.primitive.focus.offset]],
] as const

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

describe('design tokens', () => {
  it('defines required primitive and semantic layers', () => {
    expect(Object.keys(tokens.primitive)).toEqual(
      expect.arrayContaining([
        'palette',
        'typography',
        'spacing',
        'radius',
        'elevation',
        'motion',
        'breakpoint',
      ]),
    )
    expect(Object.keys(tokens.semantic)).toEqual(
      expect.arrayContaining([
        'surface',
        'text',
        'border',
        'focus',
        'action',
        'severity',
        'status',
      ]),
    )
    expect(Object.keys(tokens.semantic.severity)).toEqual([
      'critical',
      'high',
      'medium',
      'low',
    ])
    expect(Object.keys(tokens.semantic.status)).toEqual([
      'new',
      'investigating',
      'resolved',
      'dismissed',
    ])
  })

  it('maps every required canonical value', () => {
    expect(Object.entries(cssVariables)).toEqual(
      expect.arrayContaining(tokenMappingGroups.flat()),
    )
  })

  it('maps every canonical token leaf to a runtime variable', () => {
    const mappedValues = new Set(Object.values(cssVariables))

    for (const value of leafValues(tokens)) {
      expect(
        mappedValues,
        `unmapped canonical token: ${String(value)}`,
      ).toContain(value)
    }
  })

  it('applies every variable to an explicit root', () => {
    const root = document.createElement('section')

    applyCssVariables(root)

    for (const [name, value] of Object.entries(cssVariables)) {
      expect(root.style.getPropertyValue(name)).toBe(String(value))
    }
  })

  it('does not require document when applying or omitting an explicit root', () => {
    const root = document.createElement('section')
    const originalDocument = globalThis.document

    Reflect.deleteProperty(globalThis, 'document')
    try {
      expect(() => applyCssVariables(root)).not.toThrow()
      expect(() => applyCssVariables()).not.toThrow()
    } finally {
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        value: originalDocument,
        writable: true,
      })
    }

    expect(root.style.getPropertyValue('--app-color-surface-canvas')).toBe(
      tokens.semantic.surface.canvas,
    )
  })

  it.each([
    [
      'primary text on canvas',
      tokens.semantic.text.primary,
      tokens.semantic.surface.canvas,
      4.5,
    ],
    [
      'secondary text on canvas',
      tokens.semantic.text.secondary,
      tokens.semantic.surface.canvas,
      4.5,
    ],
    [
      'inverse text on action',
      tokens.semantic.text.inverse,
      tokens.semantic.action.primary,
      4.5,
    ],
    ...Object.keys(tokens.semantic.severity).map((name) => [
      `${name} severity`,
      tokens.semantic.severity[name as keyof typeof tokens.semantic.severity],
      tokens.semantic.severitySurface[
        name as keyof typeof tokens.semantic.severitySurface
      ],
      4.5,
    ]),
    ...Object.keys(tokens.semantic.status).map((name) => [
      `${name} status`,
      tokens.semantic.status[name as keyof typeof tokens.semantic.status],
      tokens.semantic.statusSurface[
        name as keyof typeof tokens.semantic.statusSurface
      ],
      4.5,
    ]),
    ...Object.entries(tokens.semantic.surface).map(([name, surface]) => [
      `focus ring on ${name} surface`,
      tokens.semantic.focus.ring,
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
      colorPrimary: tokens.semantic.action.primary,
      colorBgLayout: tokens.semantic.surface.canvas,
      colorBgContainer: tokens.semantic.surface.container,
      colorText: tokens.semantic.text.primary,
      colorTextSecondary: tokens.semantic.text.secondary,
      colorBorder: tokens.semantic.border.default,
      colorError: tokens.semantic.severity.critical,
      colorWarning: tokens.semantic.severity.medium,
      colorSuccess: tokens.semantic.status.resolved,
    })
  })
})

describe('CSS integration', () => {
  it('references every runtime token variable', () => {
    const tokenCss = readStyle('tokens.css')

    for (const name of Object.keys(cssVariables)) {
      expect(tokenCss, `${name} missing from tokens.css`).toMatch(
        new RegExp(`var\\(\\s*${name}\\s*\\)`),
      )
    }
    expect(tokenCss).not.toMatch(/#[\da-f]{3,8}\b/i)
  })

  it.each([
    ['--spacing-xs', '--app-spacing-xs'],
    ['--text-sm', '--app-font-size-sm'],
    ['--font-weight-semibold', '--app-font-weight-semibold'],
    ['--leading-normal', '--app-line-height-normal'],
    [
      '--color-severity-surface-critical',
      '--app-color-severity-surface-critical',
    ],
    ['--color-status-surface-resolved', '--app-color-status-surface-resolved'],
    ['transition-duration', '--app-motion-duration-fast'],
  ])('exposes Tailwind namespace %s', (tailwindName, appName) => {
    expect(readStyle('tokens.css')).toContain(
      `${tailwindName}: var(${appName})`,
    )
  })

  it.each(Object.entries(tokens.primitive.breakpoint))(
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
    expect(globalCss).toContain('outline-offset: var(--app-focus-offset)')
    expect(globalCss).toContain('@media (prefers-reduced-motion: reduce)')
    expect(globalCss).not.toMatch(/\.ant-[\w-]+/)
  })
})
