import type { SecurityAlert } from '../../../core/types/alerts'
import { cn } from '../../../core/utils/cn'
import { summarizeAlerts } from '../alert-derivations'

interface SummaryStatsProps {
  alerts: readonly SecurityAlert[]
}

const stats: readonly {
  key: 'total' | 'critical' | 'high' | 'mediumLow'
  label: string
  borderClass?: string
}[] = [
  { key: 'total', label: 'Total alerts' },
  {
    key: 'critical',
    label: 'Critical',
    borderClass: 'border-t-[3px] border-t-severity-critical',
  },
  {
    key: 'high',
    label: 'High',
    borderClass: 'border-t-[3px] border-t-severity-high',
  },
  {
    key: 'mediumLow',
    label: 'Medium / Low',
    borderClass: 'border-t-[3px] border-t-severity-medium',
  },
]

export function SummaryStats({ alerts }: SummaryStatsProps) {
  const summary = summarizeAlerts(alerts)

  return (
    <section
      className="grid grid-cols-2 gap-md lg:grid-cols-4"
      aria-label="Alert summary"
    >
      {stats.map(({ key, label, borderClass }) => (
        <article
          key={key}
          aria-label={label}
          className={cn(
            'border-border-default bg-surface-container rounded-md border p-md shadow-sm',
            borderClass,
          )}
        >
          <p className="text-text-secondary m-0 text-sm">{label}</p>
          <strong className="text-text-primary mt-xs block text-xl">
            {summary[key]}
          </strong>
        </article>
      ))}
    </section>
  )
}
