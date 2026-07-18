import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('application bootstrap', () => {
  it('renders the dashboard root', () => {
    expect(renderToStaticMarkup(<App />)).toContain('Security Alerts Dashboard')
  })
})
