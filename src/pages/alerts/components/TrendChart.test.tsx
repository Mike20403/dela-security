import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { systemTokens } from '../../../core/theme/tokens'
import type { SecurityAlert } from '../../../core/types/alerts'
import { TrendChart } from './TrendChart'

const barMock = vi.fn((props: unknown) => {
  void props
  return <canvas role="img" aria-label="trend-chart" />
})
vi.mock('react-chartjs-2', () => ({
  Bar: (props: unknown) => barMock(props),
}))

const makeAlert = (
  id: string,
  severity: SecurityAlert['severity'],
  detectedAt: string,
): SecurityAlert => ({
  id,
  title: 'Alert',
  severity,
  status: 'open',
  category: 'Category',
  affectedAsset: 'HOST-1',
  domainController: 'DC01.example.test',
  detectedAt,
  description: 'Description',
  recommendedAction: 'Review',
})

describe('TrendChart', () => {
  it('renders a labeled chart region', () => {
    render(<TrendChart alerts={[]} />)
    expect(
      screen.getByLabelText('Alert volume trend, last 7 days'),
    ).toBeVisible()
  })

  it('passes stacked, per-severity datasets colored from severity feedback tokens', () => {
    render(
      <TrendChart
        alerts={[makeAlert('1', 'critical', new Date().toISOString())]}
      />,
    )
    const props = barMock.mock.calls.at(-1)?.[0] as {
      data: {
        labels: string[]
        datasets: { label: string; data: number[]; backgroundColor: string }[]
      }
    }
    expect(props.data.labels).toHaveLength(7)
    expect(props.data.datasets).toHaveLength(4)
    const criticalDataset = props.data.datasets.find(
      (dataset) => dataset.label === 'Critical',
    )
    expect(criticalDataset?.backgroundColor).toBe(
      systemTokens.color.feedback.danger.foreground,
    )
    expect(criticalDataset?.data.reduce((sum, n) => sum + n, 0)).toBe(1)
  })
})
