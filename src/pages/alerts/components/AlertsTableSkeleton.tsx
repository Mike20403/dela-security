import { Skeleton } from 'antd'

export function AlertsTableSkeleton() {
  return (
    <section
      role="status"
      aria-label="Loading security alerts"
      className="border-border-default bg-background-surface overflow-hidden rounded-md border"
    >
      <span className="sr-only">Loading security alerts</span>
      <div
        className="bg-background-subtle grid grid-cols-4 gap-lg p-md"
        aria-hidden="true"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton.Input key={index} active size="small" block />
        ))}
      </div>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          data-testid="alert-skeleton-row"
          className="border-border-default grid grid-cols-4 gap-lg border-t p-md"
          aria-hidden="true"
        >
          {Array.from({ length: 4 }, (_, cell) => (
            <Skeleton.Input key={cell} active size="small" block />
          ))}
        </div>
      ))}
    </section>
  )
}
