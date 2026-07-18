import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { render } from './test/render'
import { App } from './App'

describe('application bootstrap', () => {
  it('renders the dashboard root', async () => {
    window.history.replaceState(null, '', '/alerts')
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Security alerts' }),
    ).toBeVisible()
  })
})
