import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { SecurityAlert } from '../../../core/types/alerts'
import { SummaryStats } from './SummaryStats'

const makeAlert = (severity: SecurityAlert['severity']): SecurityAlert => ({
  id: `alt-${severity}`,
  title: 'Alert',
  severity,
  status: 'open',
  category: 'Category',
  affectedAsset: 'HOST-1',
  domainController: 'DC01.example.test',
  detectedAt: '2026-07-18T12:30:00.000Z',
  description: 'Description',
  recommendedAction: 'Review',
})

describe('SummaryStats', () => {
  it('renders each severity as a compact chip with an accessible label+count name', () => {
    render(
      <SummaryStats
        alerts={[
          makeAlert('critical'),
          makeAlert('critical'),
          makeAlert('high'),
        ]}
      />,
    )

    const region = screen.getByLabelText('Alert summary')
    expect(within(region).getByText('Total: 3')).toBeVisible()
    expect(
      within(region).getByRole('listitem', { name: 'Critical 2' }),
    ).toBeVisible()
    expect(
      within(region).getByRole('listitem', { name: 'High 1' }),
    ).toBeVisible()
    expect(
      within(region).getByRole('listitem', { name: 'Medium / Low 0' }),
    ).toBeVisible()
  })

  it('uses severityPresentation classes and never renders card-tile visual language', () => {
    render(<SummaryStats alerts={[makeAlert('critical')]} />)

    const region = screen.getByLabelText('Alert summary')
    expect(region.className).not.toMatch(/grid/)
    expect(region.innerHTML).not.toMatch(/border-t-2/)
    expect(region.innerHTML).not.toMatch(/shadow-sm/)

    const critical = within(region).getByRole('listitem', {
      name: 'Critical 1',
    })
    expect(critical.className).toMatch(/bg-severity-surface-critical/)
    expect(critical.className).not.toMatch(/border-t-2/)
    expect(critical.className).not.toMatch(/shadow-sm/)
  })
})
