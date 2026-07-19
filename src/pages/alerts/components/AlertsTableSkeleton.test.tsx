import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AlertsTableSkeleton } from './AlertsTableSkeleton'

describe('AlertsTableSkeleton', () => {
  it('reflects the real 8 table columns exactly', () => {
    render(<AlertsTableSkeleton />)

    const header = screen.getByTestId('alert-skeleton-header')
    expect(
      within(header).getAllByRole('presentation', { hidden: true }),
    ).toHaveLength(8)

    for (const label of [
      'Severity',
      'Title',
      'Category',
      'Affected Asset',
      'Domain Controller',
      'Detected',
      'Status',
      'Actions',
    ]) {
      expect(within(header).getByText(label)).toBeInTheDocument()
    }

    const rows = screen.getAllByTestId('alert-skeleton-row')
    for (const row of rows) {
      expect(
        within(row).getAllByRole('presentation', { hidden: true }),
      ).toHaveLength(8)
    }
  })
})
