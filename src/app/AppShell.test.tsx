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

  it('keeps an accessible Alerts link name and shows an icon when collapsed', async () => {
    renderShell()

    await userEvent.click(
      screen.getByRole('button', { name: /collapse sidebar/i }),
    )

    const alertsLink = screen.getByRole('link', { name: 'Alerts' })
    expect(alertsLink.querySelector('svg')).toBeInTheDocument()
  })

  it('renders an icon inside the collapse toggle button', () => {
    renderShell()

    const toggle = screen.getByRole('button', { name: /collapse sidebar/i })
    expect(toggle.querySelector('svg')).toBeInTheDocument()
  })

  it('places the collapse toggle in the header row next to the logo', () => {
    renderShell()

    const toggle = screen.getByRole('button', { name: /collapse sidebar/i })
    const logo = screen.getByRole('img', { name: 'DELA Security logo' })
    const header = logo.closest('div')

    expect(header).toContainElement(toggle)
  })

  it('keeps the sidebar pinned to the viewport instead of scrolling with page content', () => {
    renderShell()

    const sidebar = screen.getByRole('navigation').closest('aside')
    expect(sidebar?.className).toMatch(/lg:sticky/)
    expect(sidebar?.className).toMatch(/lg:top-0/)
    expect(sidebar?.className).toMatch(/lg:h-screen/)
  })

  it('has a mobile menu button with correct aria attributes and accessible name', () => {
    renderShell()

    const sidebar = screen.getByRole('navigation').closest('aside')
    const menuButton = screen.getByRole('button', { name: 'Open navigation' })

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveAttribute('aria-controls', sidebar?.id)
  })

  it('opens the mobile sidebar when the menu button is clicked', async () => {
    renderShell()

    const sidebar = screen.getByRole('navigation').closest('aside')
    const menuButton = screen.getByRole('button', { name: 'Open navigation' })

    expect(sidebar?.className).toMatch(/-translate-x-full/)

    await userEvent.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    expect(sidebar?.className).not.toMatch(/-translate-x-full/)
  })

  it('closes the mobile sidebar when the backdrop is clicked', async () => {
    renderShell()

    const menuButton = screen.getByRole('button', { name: 'Open navigation' })
    await userEvent.click(menuButton)

    const backdrop = screen.getByTestId('sidebar-backdrop')
    await userEvent.click(backdrop)

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the mobile sidebar when Escape is pressed', async () => {
    renderShell()

    const menuButton = screen.getByRole('button', { name: 'Open navigation' })
    await userEvent.click(menuButton)
    expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('gives main the classes needed to avoid fixed-width overflow', () => {
    renderShell()

    const main = screen.getByRole('main')
    expect(main.className).toContain('min-w-0')
    expect(main.className).toContain('flex-1')
    expect(main.className).toContain('w-full')
  })

  it('provides a skip link that moves focus to main content', async () => {
    renderShell()

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' })
    expect(skipLink).toHaveAttribute('href', '#main-content')

    await userEvent.click(skipLink)

    expect(screen.getByRole('main')).toHaveFocus()
  })
})
