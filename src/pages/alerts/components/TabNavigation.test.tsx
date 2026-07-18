import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TabNavigation } from './TabNavigation'

describe('TabNavigation', () => {
  it('renders controlled badges and reports selection', async () => {
    const onChange = vi.fn()
    render(
      <TabNavigation
        activeId="all"
        onChange={onChange}
        items={[
          { id: 'all', label: 'All', badge: 12 },
          { id: 'open', label: 'Open', badge: 3 },
        ]}
      />,
    )

    expect(screen.getByRole('tab', { name: 'All 12' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    await userEvent.click(screen.getByRole('tab', { name: 'Open 3' }))
    expect(onChange).toHaveBeenCalledWith('open')
  })

  it('honors disabled items', async () => {
    const onChange = vi.fn()
    render(
      <TabNavigation
        activeId="all"
        onChange={onChange}
        items={[
          { id: 'all', label: 'All' },
          { id: 'disabled', label: 'Disabled', disabled: true },
        ]}
      />,
    )

    const disabled = screen.getByRole('tab', { name: 'Disabled' })
    expect(disabled).toHaveAttribute('aria-disabled', 'true')
    await userEvent.click(disabled)
    expect(onChange).not.toHaveBeenCalled()
  })
})
