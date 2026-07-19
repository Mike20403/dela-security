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
  it('gives the value stronger visual weight than the label', () => {
    render(<SummaryStats alerts={[makeAlert('critical')]} />)

    const tile = screen.getByLabelText('Total alerts')
    const value = within(tile).getByText('1')
    const label = within(tile).getByText('Total alerts')

    expect(value.className).toMatch(/text-2xl|text-xl/)
    expect(value.className).toMatch(/font-semibold|font-weight-semibold/)
    expect(label.className).toMatch(/text-foreground-muted/)
    expect(label.className).toMatch(/text-xs|text-sm/)
  })

  it('keeps semantic article grouping without heavy card borders on every tile', () => {
    render(<SummaryStats alerts={[makeAlert('critical')]} />)

    const total = screen.getByLabelText('Total alerts')
    expect(total.className).not.toMatch(/shadow-sm/)
  })
})
