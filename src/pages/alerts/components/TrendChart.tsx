import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type TooltipItem,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { systemTokens } from '../../../core/theme/tokens'
import type { SecurityAlert } from '../../../core/types/alerts'
import { buildSeverityTrend } from '../alert-derivations'
import { severityOrder, severityPresentation } from '../alert-presentation'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
)

// Severity -> feedback role hex, sourced from systemTokens (single source of truth for
// raw color; see tokens.css comment: critical->danger, high->caution, medium->warning, low->neutral).
const severityColor: Record<SecurityAlert['severity'], string> = {
  critical: systemTokens.color.feedback.danger.foreground,
  high: systemTokens.color.feedback.caution.foreground,
  medium: systemTokens.color.feedback.warning.foreground,
  low: systemTokens.color.feedback.neutral.foreground,
}

// Distinct dash pattern per severity so overlapping same-value lines stay
// visually separable even when their y-values coincide.
const severityDash: Record<SecurityAlert['severity'], number[]> = {
  critical: [],
  high: [8, 4],
  medium: [2, 2],
  low: [1, 3],
}

// Distinct point marker shape per severity — stays visible at each vertex
// even when two lines share the exact same value and their dashes overlap.
const severityPointStyle: Record<
  SecurityAlert['severity'],
  'circle' | 'triangle' | 'rect' | 'rectRot'
> = {
  critical: 'circle',
  high: 'triangle',
  medium: 'rect',
  low: 'rectRot',
}

interface TrendChartProps {
  alerts: readonly SecurityAlert[]
}

export function TrendChart({ alerts }: TrendChartProps) {
  const trend = buildSeverityTrend(alerts)

  // Mock data often produces identical day-over-day counts across severities,
  // which makes same-valued lines render as a single overlapping stroke.
  // Apply a small fixed per-severity vertical offset for *display only*;
  // tooltips read the original, un-jittered count via `rawData`.
  const jitterStep = 0.06
  const data = {
    labels: trend.map((bucket) => bucket.day),
    datasets: severityOrder.map((severity, index) => {
      const rawData = trend.map((bucket) => bucket[severity])
      return {
        label: severityPresentation[severity].label,
        data: rawData.map((value) => value + index * jitterStep),
        rawData,
        borderColor: severityColor[severity],
        backgroundColor: severityColor[severity],
        pointBackgroundColor: severityColor[severity],
        borderDash: severityDash[severity],
        pointStyle: severityPointStyle[severity],
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 10,
        tension: 0.3,
      }
    }),
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const dataset = context.dataset as { rawData?: number[] }
            const value = dataset.rawData?.[context.dataIndex] ?? 0
            return `${context.dataset.label}: ${value}`
          },
        },
      },
      legend: { position: 'top' as const },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          callback: (value: string | number) => Math.round(Number(value)),
        },
      },
    },
  }

  return (
    <section
      aria-label="Alert volume trend, last 7 days"
      className="border-border-default bg-background-surface rounded-md border p-md"
    >
      <div style={{ height: 280 }}>
        <Line data={data} options={options} />
      </div>
    </section>
  )
}
