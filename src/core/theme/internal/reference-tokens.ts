type TokenTree = { readonly [key: string]: string | number | TokenTree }

// Internal implementation detail. Not part of design-system public contract.
export const referenceTokens = {
  color: {
    white: '#ffffff',
    neutral: {
      25: '#f8fafc',
      50: '#f1f5f9',
      100: '#e2e8f0',
      200: '#cbd5e1',
      300: '#94a3b8',
      500: '#475569',
      700: '#1e293b',
      900: '#0f172a',
    },
    blue: { 50: '#eff6ff', 600: '#2563eb', 700: '#1d4ed8' },
    red: { 50: '#fef2f2', 700: '#b91c1c' },
    orange: { 50: '#fff7ed', 700: '#c2410c' },
    amber: { 50: '#fffbeb', 700: '#a16207' },
    cyan: { 50: '#ecfeff', 700: '#0e7490' },
    green: { 50: '#f0fdf4', 700: '#15803d' },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
  },
  typography: {
    family: {
      sans: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    size: {
      1: '0.75rem',
      2: '0.875rem',
      3: '1rem',
      4: '1.125rem',
      5: '1.25rem',
    },
    weight: { regular: 400, medium: 500, semibold: 600 },
    lineHeight: { compact: 1.25, normal: 1.5 },
  },
  radius: { 0: '0', 1: '0.25rem', 2: '0.375rem', 3: '0.5rem' },
  shadow: {
    1: '0 1px 2px rgb(15 23 42 / 0.06)',
    2: '0 4px 12px rgb(15 23 42 / 0.08)',
  },
  motion: {
    duration: { fast: '100ms', normal: '180ms' },
    easing: { standard: 'cubic-bezier(0.2, 0, 0, 1)' },
  },
  breakpoint: { sm: '40rem', md: '48rem', lg: '64rem', xl: '80rem' },
  focus: { width: '2px', offset: '2px' },
} as const satisfies TokenTree
