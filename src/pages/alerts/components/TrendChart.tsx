import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { systemTokens } from '../../../core/theme/tokens'
import type { SecurityAlert } from '../../../core/types/alerts'
import { buildSeverityTrend } from '../alert-derivations'
import { severityOrder, severityPresentation } from '../alert-presentation'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// Severity -> feedback role hex, sourced from systemTokens (single source of truth for
// raw color; see tokens.css comment: critical->danger, high->caution, medium->warning, low->neutral).
const severityColor: Record<SecurityAlert['severity'], string> = {
  critical: systemTokens.color.feedback.danger.foreground,
  high: systemTokens.color.feedback.caution.foreground,
  medium: systemTokens.color.feedback.warning.foreground,
  low: systemTokens.color.feedback.neutral.foreground,
}

interface TrendChartProps {
  alerts: readonly SecurityAlert[]
}

export function TrendChart({ alerts }: TrendChartProps) {
  const trend = buildSeverityTrend(alerts)

  const data = {
    labels: trend.map((bucket) => bucket.day),
    datasets: severityOrder.map((severity) => ({
      label: severityPresentation[severity].label,
      data: trend.map((bucket) => bucket[severity]),
      backgroundColor: severityColor[severity],
      stack: 'severity',
    })),
  }

  const options = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
    },
  }

  return (
    <section
      aria-label="Alert volume trend, last 7 days"
      className="border-border-default bg-background-surface rounded-md border p-md"
    >
      <Bar data={data} options={options} />
    </section>
  )
}
