import { Button, Descriptions, Drawer, Select, Tag } from 'antd'
import { useRef } from 'react'
import type { AlertStatus, SecurityAlert } from '../../../core/types/alerts'
import { formatDetectedAt } from '../alert-derivations'

interface AlertDetailDrawerProps {
  alert: SecurityAlert | undefined
  open: boolean
  pending: boolean
  onClose: () => void
  onAfterOpenChange?: (open: boolean) => void
  onStatusChange: (status: AlertStatus) => void
  onAssignToMe: () => void
}

const statusOptions: { label: string; value: AlertStatus }[] = [
  { label: 'Open', value: 'open' },
  { label: 'In Review', value: 'in_review' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Suppressed', value: 'suppressed' },
]
const severityLabels = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
} as const

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
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ID">{alert.id}</Descriptions.Item>
            <Descriptions.Item label="Title">{alert.title}</Descriptions.Item>
            <Descriptions.Item label="Severity">
              <Tag>{severityLabels[alert.severity]}</Tag>
            </Descriptions.Item>
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
            <Descriptions.Item label="Category">
              {alert.category}
            </Descriptions.Item>
            <Descriptions.Item label="Affected asset">
              {alert.affectedAsset}
            </Descriptions.Item>
            <Descriptions.Item label="Domain controller">
              {alert.domainController}
            </Descriptions.Item>
            <Descriptions.Item label="Detected">
              {formatDetectedAt(alert.detectedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Assigned to">
              {alert.assignedTo ?? 'Unassigned'}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {alert.description}
            </Descriptions.Item>
            <Descriptions.Item label="Recommended action">
              {alert.recommendedAction}
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Drawer>
  )
}
