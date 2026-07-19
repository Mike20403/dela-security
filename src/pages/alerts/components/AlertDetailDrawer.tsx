import { Button, Descriptions, Drawer, Select, Tag } from 'antd'
import { useRef } from 'react'
import type { AlertStatus, SecurityAlert } from '../../../core/types/alerts'
import { formatDetectedAt } from '../alert-derivations'
import { severityPresentation, statusOptions } from '../alert-presentation'

interface AlertDetailDrawerProps {
  alert: SecurityAlert | undefined
  open: boolean
  pending: boolean
  onClose: () => void
  onAfterOpenChange?: (open: boolean) => void
  onStatusChange: (status: AlertStatus) => void
  onAssignToMe: () => void
}

export function AlertDetailDrawer({
  alert,
  open,
  pending,
  onClose,
  onAfterOpenChange,
  onStatusChange,
  onAssignToMe,
}: AlertDetailDrawerProps) {
  const firstActionRef = useRef<HTMLButtonElement>(null)

  return (
    <Drawer
      title="Alert details"
      open={open}
      onClose={onClose}
      afterOpenChange={(nextOpen) => {
        if (nextOpen) firstActionRef.current?.focus()
        onAfterOpenChange?.(nextOpen)
      }}
      width="min(40rem, 100vw)"
      destroyOnClose
      extra={
        <Button
          ref={firstActionRef}
          onClick={onAssignToMe}
          loading={pending}
          disabled={pending || !alert || alert.assignedTo === 'Alex Morgan'}
        >
          Assign to me
        </Button>
      }
    >
      {alert && (
        <div className="space-y-lg">
          <section aria-labelledby="drawer-section-overview">
            <h3
              id="drawer-section-overview"
              className="text-foreground-muted mb-xs text-xs font-semibold tracking-wide uppercase"
            >
              Overview
            </h3>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="ID">{alert.id}</Descriptions.Item>
              <Descriptions.Item label="Title">{alert.title}</Descriptions.Item>
              <Descriptions.Item label="Severity">
                <Tag>{severityPresentation[alert.severity].label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {alert.category}
              </Descriptions.Item>
            </Descriptions>
          </section>

          <section aria-labelledby="drawer-section-detection">
            <h3
              id="drawer-section-detection"
              className="text-foreground-muted mb-xs text-xs font-semibold tracking-wide uppercase"
            >
              Detection context
            </h3>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Affected asset">
                {alert.affectedAsset}
              </Descriptions.Item>
              <Descriptions.Item label="Domain controller">
                {alert.domainController}
              </Descriptions.Item>
              <Descriptions.Item label="Detected">
                {formatDetectedAt(alert.detectedAt)}
              </Descriptions.Item>
            </Descriptions>
          </section>

          <section aria-labelledby="drawer-section-ownership">
            <h3
              id="drawer-section-ownership"
              className="text-foreground-muted mb-xs text-xs font-semibold tracking-wide uppercase"
            >
              Ownership and status
            </h3>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Status">
                <Select
                  aria-label="Alert status"
                  value={alert.status}
                  options={statusOptions}
                  virtual={false}
                  onChange={onStatusChange}
                  disabled={pending}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Assigned to">
                {alert.assignedTo ?? 'Unassigned'}
              </Descriptions.Item>
            </Descriptions>
          </section>

          <section aria-labelledby="drawer-section-analysis">
            <h3
              id="drawer-section-analysis"
              className="text-foreground-muted mb-xs text-xs font-semibold tracking-wide uppercase"
            >
              Analysis
            </h3>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Description">
                {alert.description}
              </Descriptions.Item>
            </Descriptions>
          </section>

          <section aria-labelledby="drawer-section-recommendation">
            <h3
              id="drawer-section-recommendation"
              className="text-foreground-muted mb-xs text-xs font-semibold tracking-wide uppercase"
            >
              Recommended action
            </h3>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Recommended action">
                {alert.recommendedAction}
              </Descriptions.Item>
            </Descriptions>
          </section>
        </div>
      )}
    </Drawer>
  )
}
