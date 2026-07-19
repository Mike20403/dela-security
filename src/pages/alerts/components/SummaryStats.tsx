import type { SecurityAlert } from '../../../core/types/alerts'
import { cn } from '../../../core/utils/cn'
import { summarizeAlerts } from '../alert-derivations'
import { severityPresentation } from '../alert-presentation'

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
    label: severityPresentation.critical.label,
    borderClass: `border-t-2 ${severityPresentation.critical.borderTopClassName}`,
  },
  {
    key: 'high',
    label: severityPresentation.high.label,
    borderClass: `border-t-2 ${severityPresentation.high.borderTopClassName}`,
  },
  {
    key: 'mediumLow',
    label: 'Medium / Low',
    borderClass: `border-t-2 ${severityPresentation.medium.borderTopClassName}`,
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
          className={cn('bg-background-surface rounded-md p-sm', borderClass)}
        >
          <p className="text-foreground-muted m-0 text-xs">{label}</p>
          <strong className="text-foreground-default font-bold mt-xs block text-2xl">
            {summary[key]}
          </strong>
        </article>
      ))}
    </section>
  )
}
