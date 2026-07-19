import { Skeleton } from 'antd'

const columnLabels = [
  'Severity',
  'Title',
  'Category',
  'Affected Asset',
  'Domain Controller',
  'Detected',
  'Status',
  'Actions',
]

export function AlertsTableSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading security alerts"
      className="border-border-default bg-background-surface overflow-hidden rounded-md border"
    >
      <span className="sr-only">Loading security alerts</span>
      <div
        data-testid="alert-skeleton-header"
        className="bg-background-subtle grid grid-cols-8 gap-lg p-md"
        aria-hidden="true"
      >
        {columnLabels.map((label) => (
          <div key={label} role="presentation">
            <span className="text-foreground-muted mb-xs block text-xs">
              {label}
            </span>
            <Skeleton.Input active size="small" block />
          </div>
        ))}
      </div>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          data-testid="alert-skeleton-row"
          className="border-border-default grid grid-cols-8 gap-lg border-t p-md"
          aria-hidden="true"
        >
          {columnLabels.map((label) => (
            <div key={label} role="presentation">
              <Skeleton.Input active size="small" block />
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
