import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppShell } from './AppShell'

function renderShell(path = '/alerts') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppShell>
        <p>Page content</p>
      </AppShell>
    </MemoryRouter>,
  )
}

describe('AppShell', () => {
  it('renders a nav landmark with an Alerts link marked as the current route', () => {
    renderShell('/alerts')

    const nav = screen.getByRole('navigation')
    const alertsLink = screen.getByRole('link', { name: 'Alerts' })
    expect(nav).toContainElement(alertsLink)
    expect(alertsLink).toHaveAttribute('aria-current', 'page')
  })

  it('renders the product name and logo, and the page content in a main landmark', () => {
    renderShell()

    expect(screen.getByText('DELA Security')).toBeVisible()
    expect(
      screen.getByRole('img', { name: 'DELA Security logo' }),
    ).toBeVisible()
    expect(screen.getByRole('main')).toHaveTextContent('Page content')
  })

  it('has a collapse toggle with an accessible name and aria-expanded that flips on click', async () => {
    renderShell()

    const toggle = screen.getByRole('button', { name: /collapse sidebar/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    await userEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /expand sidebar/i }),
    ).toBeInTheDocument()
  })

  it('hides the product name text but keeps the logo visible when collapsed', async () => {
    renderShell()

    await userEvent.click(
      screen.getByRole('button', { name: /collapse sidebar/i }),
    )

    expect(screen.queryByText('DELA Security')).not.toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'DELA Security logo' }),
    ).toBeVisible()
  })

  it('provides a skip link that moves focus to main content', async () => {
    renderShell()

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skipLink).toHaveAttribute('href', '#main-content')

    await userEvent.click(skipLink)

    expect(screen.getByRole('main')).toHaveFocus()
  })
})
