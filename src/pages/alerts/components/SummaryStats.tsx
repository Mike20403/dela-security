import type { SecurityAlert } from '../../../core/types/alerts'
import { cn } from '../../../core/utils/cn'
import { summarizeAlerts } from '../alert-derivations'
import { severityPresentation } from '../alert-presentation'

interface SummaryStatsProps {
  alerts: readonly SecurityAlert[]
}

const chips: readonly {
  key: 'critical' | 'high' | 'mediumLow'
  label: string
  className: string
}[] = [
  {
    key: 'critical',
    label: severityPresentation.critical.label,
    className: severityPresentation.critical.className,
  },
  {
    key: 'high',
    label: severityPresentation.high.label,
    className: severityPresentation.high.className,
  },
  {
    key: 'mediumLow',
    label: 'Medium / Low',
    className: severityPresentation.medium.className,
  },
]

export function SummaryStats({ alerts }: SummaryStatsProps) {
  const summary = summarizeAlerts(alerts)

  return (
    <section
      className="flex flex-wrap items-center gap-sm"
      aria-label="Alert summary"
    >
      <span className="text-foreground-muted text-xs" aria-label="Total alerts">
        Total: {summary.total}
      </span>
      <ul className="m-0 flex list-none flex-wrap items-center gap-sm p-0">
        {chips.map(({ key, label, className }) => (
          <li
            key={key}
            aria-label={`${label} ${summary[key]}`}
            className={cn(
              'inline-flex items-center gap-xs rounded-full px-sm py-xs text-xs',
              className,
            )}
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-current"
            />
            <span>
              {label} {summary[key]}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
