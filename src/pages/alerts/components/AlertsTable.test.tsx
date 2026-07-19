import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { SecurityAlert } from '../../../core/types/alerts'
import { AlertsTable } from './AlertsTable'

const makeAlert = (index: number): SecurityAlert => ({
  id: `ALT-${index}`,
  title: `Alert ${index}`,
  severity: index % 2 ? 'critical' : 'low',
  status: index % 2 ? 'open' : 'resolved',
  category: 'Credential Access',
  affectedAsset: `HOST-${index}`,
  domainController: 'DC01.example.test',
  detectedAt: '2026-07-18T12:30:00.000Z',
  description: 'Description',
  recommendedAction: 'Review',
})

describe('AlertsTable', () => {
  it('renders exact columns and semantic human-readable tags', () => {
    render(<AlertsTable alerts={[makeAlert(1)]} onSelectAlert={vi.fn()} />)

    for (const name of [
      'Severity',
      'Title',
      'Category',
      'Affected Asset',
      'Domain Controller',
      'Detected',
      'Status',
      'Actions',
    ]) {
      expect(screen.getByRole('columnheader', { name })).toBeVisible()
    }
    expect(screen.getByText('Critical')).toBeVisible()
    expect(screen.getByText('Open')).toBeVisible()
    expect(screen.getByText('Jul 18, 2026, 12:30 PM')).toBeVisible()
  })

  it('shows meaningful empty state and hides single-page pagination', () => {
    const { rerender } = render(
      <AlertsTable alerts={[]} onSelectAlert={vi.fn()} />,
    )
    expect(screen.getByText('No matching alerts')).toBeVisible()
    expect(screen.queryByRole('list', { name: /pagination/i })).toBeNull()

    rerender(<AlertsTable alerts={[makeAlert(1)]} onSelectAlert={vi.fn()} />)
    expect(screen.queryByRole('list', { name: /pagination/i })).toBeNull()
  })

  it('paginates at 15 rows and resets for a same-length replacement', async () => {
    const alerts = Array.from({ length: 16 }, (_, index) =>
      makeAlert(index + 1),
    )
    const { rerender } = render(
      <AlertsTable alerts={alerts} onSelectAlert={vi.fn()} />,
    )
    expect(screen.getAllByRole('row')).toHaveLength(16)
    await userEvent.click(screen.getByTitle('2'))
    expect(screen.getByText('Alert 16')).toBeVisible()

    const replacements = Array.from({ length: 16 }, (_, index) =>
      makeAlert(index + 101),
    )
    rerender(<AlertsTable alerts={replacements} onSelectAlert={vi.fn()} />)
    expect(screen.getByText('Alert 101')).toBeVisible()
    expect(screen.queryByText('Alert 116')).toBeNull()
    expect(screen.getByTitle('1')).toHaveClass('ant-pagination-item-active')
  })

  it('selects exact records by click, Enter, Space, and action without propagation', async () => {
    const user = userEvent.setup()
    const onSelectAlert = vi.fn()
    render(
      <AlertsTable
        alerts={[makeAlert(1), makeAlert(2)]}
        onSelectAlert={onSelectAlert}
      />,
    )
    const first = makeAlert(1)
    const second = makeAlert(2)
    const firstRow = screen.getByRole('row', { name: 'Select alert Alert 1' })
    const secondRow = screen.getByRole('row', { name: 'Select alert Alert 2' })

    expect(firstRow).toHaveAttribute('tabindex', '0')
    await user.click(firstRow)
    expect(onSelectAlert).toHaveBeenLastCalledWith(first)

    firstRow.focus()
    await user.keyboard('{Enter}')
    expect(onSelectAlert).toHaveBeenLastCalledWith(first)

    secondRow.focus()
    await user.keyboard(' ')
    expect(onSelectAlert).toHaveBeenLastCalledWith(second)

    await user.click(
      within(secondRow).getByRole('button', { name: 'View Alert 2' }),
    )
    expect(onSelectAlert).toHaveBeenCalledTimes(4)
    expect(onSelectAlert).toHaveBeenLastCalledWith(second)

    within(secondRow).getByRole('button', { name: 'View Alert 2' }).focus()
    await user.keyboard('{Enter}')
    expect(onSelectAlert).toHaveBeenCalledTimes(5)
    expect(onSelectAlert).toHaveBeenLastCalledWith(second)
  })

  it('applies a monospace-style class to technical identifier values', () => {
    render(<AlertsTable alerts={[makeAlert(1)]} onSelectAlert={vi.fn()} />)

    expect(screen.getByText('HOST-1')).toHaveClass('font-mono')
    expect(screen.getByText('DC01.example.test')).toHaveClass('font-mono')
  })

  it('gives the Title column stronger emphasis than other data cells', () => {
    render(<AlertsTable alerts={[makeAlert(1)]} onSelectAlert={vi.fn()} />)

    const title = screen.getByText('Alert 1')
    expect(title.className).toMatch(/font-weight-semibold|font-semibold/)
  })

  it('shows explicit UTC timezone context near the Detected header', () => {
    render(<AlertsTable alerts={[makeAlert(1)]} onSelectAlert={vi.fn()} />)

    const header = screen.getByRole('columnheader', { name: /Detected/ })
    expect(header).toHaveTextContent('UTC')
  })

  it('marks the table container as sticky-header-scope via a class contract', () => {
    const { container } = render(
      <AlertsTable alerts={[makeAlert(1)]} onSelectAlert={vi.fn()} />,
    )

    expect(container.firstChild).toHaveClass('sticky-header-scope')
  })

  it('announces a results-count caption describing visible rows', () => {
    render(
      <AlertsTable
        alerts={[makeAlert(1), makeAlert(2)]}
        onSelectAlert={vi.fn()}
      />,
    )

    expect(screen.getByText('Showing 2 alerts')).toBeInTheDocument()
  })
})
