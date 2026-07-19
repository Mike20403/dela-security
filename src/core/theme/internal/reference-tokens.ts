type TokenTree = { readonly [key: string]: string | number | TokenTree }

// Internal implementation detail. Not part of design-system public contract.
export const referenceTokens = {
  color: {
    white: '#ffffff',
    neutral: {
      25: '#f7f7fb',
      50: '#eeeef5',
      100: '#dcdce8',
      200: '#c3c2d6',
      300: '#928fb0',
      500: '#5a5674',
      700: '#2a2740',
      900: '#131226',
    },
    blue: { 50: '#efedfc', 600: '#4f3cc9', 700: '#3f2fa8' },
    red: { 50: '#fdf1f2', 700: '#a11d3a' },
    orange: { 50: '#fdf3ec', 700: '#a3520f' },
    amber: { 50: '#fdf7e8', 700: '#8f6a0a' },
    cyan: { 50: '#eafaf7', 700: '#0e766f' },
    green: { 50: '#eefaf1', 700: '#157a44' },
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
