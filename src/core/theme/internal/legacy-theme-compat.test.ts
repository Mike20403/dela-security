import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { systemTokens } from '../tokens.ts'
import {
  applyCssVariables,
  cssVariables,
  legacyAlertTokenAdapter,
  legacyCssVariables,
} from './legacy-theme-compat.ts'

const expectedLegacyCssVariables = {
  '--app-color-surface-canvas': '#f8fafc',
  '--app-color-surface-container': '#ffffff',
  '--app-color-surface-muted': '#f1f5f9',
  '--app-color-surface-elevated': '#ffffff',
  '--app-color-text-primary': '#0f172a',
  '--app-color-text-strong': '#1e293b',
  '--app-color-text-secondary': '#475569',
  '--app-color-text-inverse': '#ffffff',
  '--app-color-text-disabled': '#94a3b8',
  '--app-color-border-default': '#cbd5e1',
  '--app-color-border-subtle': '#e2e8f0',
  '--app-color-border-strong': '#94a3b8',
  '--app-color-focus-ring': '#2563eb',
  '--app-color-focus-offset': '#ffffff',
  '--app-color-action-primary': '#2563eb',
  '--app-color-action-hover': '#1d4ed8',
  '--app-color-action-subtle': '#eff6ff',
  '--app-color-severity-critical': '#b91c1c',
  '--app-color-severity-high': '#c2410c',
  '--app-color-severity-medium': '#a16207',
  '--app-color-severity-low': '#0e7490',
  '--app-color-severity-surface-critical': '#fef2f2',
  '--app-color-severity-surface-high': '#fff7ed',
  '--app-color-severity-surface-medium': '#fffbeb',
  '--app-color-severity-surface-low': '#ecfeff',
  '--app-color-status-new': '#2563eb',
  '--app-color-status-investigating': '#a16207',
  '--app-color-status-resolved': '#15803d',
  '--app-color-status-dismissed': '#475569',
  '--app-color-status-surface-new': '#eff6ff',
  '--app-color-status-surface-investigating': '#fffbeb',
  '--app-color-status-surface-resolved': '#f0fdf4',
  '--app-color-status-surface-dismissed': '#f1f5f9',
  '--app-font-sans':
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  '--app-font-mono':
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  '--app-font-size-xs': '0.75rem',
  '--app-font-size-sm': '0.875rem',
  '--app-font-size-base': '1rem',
  '--app-font-size-lg': '1.125rem',
  '--app-font-size-xl': '1.25rem',
  '--app-font-weight-normal': 400,
  '--app-font-weight-medium': 500,
  '--app-font-weight-semibold': 600,
  '--app-line-height-normal': 1.5,
  '--app-spacing-xs': '0.25rem',
  '--app-spacing-sm': '0.5rem',
  '--app-spacing-md': '1rem',
  '--app-spacing-lg': '1.5rem',
  '--app-spacing-xl': '2rem',
  '--app-radius-sm': '0.25rem',
  '--app-radius-md': '0.375rem',
  '--app-radius-lg': '0.5rem',
  '--app-shadow-sm': '0 1px 2px rgb(15 23 42 / 0.06)',
  '--app-shadow-md': '0 4px 12px rgb(15 23 42 / 0.08)',
  '--app-motion-duration-fast': '100ms',
  '--app-motion-duration-normal': '180ms',
  '--app-motion-ease': 'cubic-bezier(0.2, 0, 0, 1)',
  '--app-breakpoint-sm': '40rem',
  '--app-breakpoint-md': '48rem',
  '--app-breakpoint-lg': '64rem',
  '--app-breakpoint-xl': '80rem',
  '--app-focus-offset': '2px',
} as const

describe('legacy theme compatibility', () => {
  it('keeps exact 62 runtime CSS names and values stable', () => {
    expect(Object.keys(legacyCssVariables)).toHaveLength(62)
    expect(legacyCssVariables).toEqual(expectedLegacyCssVariables)
    expect(cssVariables).toBe(legacyCssVariables)
  })

  it('references every runtime CSS name', () => {
    const tokenCss = readFileSync(
      `${process.cwd()}/src/styles/tokens.css`,
      'utf8',
    )

    for (const name of Object.keys(cssVariables)) {
      expect(tokenCss, `${name} missing from tokens.css`).toMatch(
        new RegExp(`var\\(\\s*${name}\\s*\\)`),
      )
    }
    expect(tokenCss).not.toMatch(/#[\da-f]{3,8}\b/i)
  })

  it('keeps exact alert compatibility values stable', () => {
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

  it('applies every variable to an explicit root', () => {
    const root = document.createElement('section')
    applyCssVariables(root)

    for (const [name, value] of Object.entries(cssVariables)) {
      expect(root.style.getPropertyValue(name)).toBe(String(value))
    }
  })

  it('does not require document when root is explicit or omitted', () => {
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
      systemTokens.color.background.canvas,
    )
  })
})
