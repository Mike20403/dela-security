import { Button, Empty, Table, Tag } from 'antd'
import type { TableColumnsType, TablePaginationConfig } from 'antd'
import { useState } from 'react'
import type {
  AlertSeverity,
  AlertStatus,
  SecurityAlert,
} from '../../../core/types/alerts'
import { formatDetectedAt } from '../alert-derivations'

interface AlertsTableProps {
  alerts: readonly SecurityAlert[]
  onSelectAlert: (alert: SecurityAlert) => void
}

const severityLabels: Record<AlertSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}
const statusLabels: Record<AlertStatus, string> = {
  open: 'Open',
  in_review: 'In Review',
  resolved: 'Resolved',
  suppressed: 'Suppressed',
}
const severityClasses: Record<AlertSeverity, string> = {
  critical: 'text-severity-critical bg-severity-surface-critical',
  high: 'text-severity-high bg-severity-surface-high',
  medium: 'text-severity-medium bg-severity-surface-medium',
  low: 'text-severity-low bg-severity-surface-low',
}
const statusClasses: Record<AlertStatus, string> = {
  open: 'text-status-new bg-status-surface-new',
  in_review: 'text-status-investigating bg-status-surface-investigating',
  resolved: 'text-status-resolved bg-status-surface-resolved',
  suppressed: 'text-status-dismissed bg-status-surface-dismissed',
}

export function AlertsTable({ alerts, onSelectAlert }: AlertsTableProps) {
  const resultKey = alerts.map(({ id }) => id).join('\u001f')

  return (
    <PaginatedAlertsTable
      key={resultKey}
      alerts={alerts}
      onSelectAlert={onSelectAlert}
    />
  )
}

function PaginatedAlertsTable({ alerts, onSelectAlert }: AlertsTableProps) {
  const [page, setPage] = useState(1)

  const columns: TableColumnsType<SecurityAlert> = [
    {
      title: 'Severity',
      dataIndex: 'severity',
      width: 110,
      render: (severity: AlertSeverity) => (
        <Tag bordered={false} className={severityClasses[severity]}>
          {severityLabels[severity]}
        </Tag>
      ),
    },
    { title: 'Title', dataIndex: 'title', width: 280, rowScope: 'row' },
    { title: 'Category', dataIndex: 'category', width: 160 },
    { title: 'Affected Asset', dataIndex: 'affectedAsset', width: 170 },
    { title: 'Domain Controller', dataIndex: 'domainController', width: 210 },
    {
      title: 'Detected',
      dataIndex: 'detectedAt',
      width: 190,
      render: (value: string) => formatDetectedAt(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (status: AlertStatus) => (
        <Tag bordered={false} className={statusClasses[status]}>
          {statusLabels[status]}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, alert) => (
        <Button
          type="link"
          size="small"
          aria-label={`View ${alert.title}`}
          onClick={(event) => {
            event.stopPropagation()
            onSelectAlert(alert)
          }}
        >
          View
        </Button>
      ),
    },
  ]

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize: 15,
    total: alerts.length,
    hideOnSinglePage: true,
    showSizeChanger: false,
    onChange: setPage,
  }

  return (
    <Table<SecurityAlert>
      aria-label="Security alerts"
      columns={columns}
      dataSource={[...alerts]}
      rowKey="id"
      pagination={pagination}
      scroll={{ x: 1340 }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No matching alerts"
          />
        ),
      }}
      onRow={(alert) => ({
        onClick: () => onSelectAlert(alert),
        onKeyDown: (event) => {
          if (event.target !== event.currentTarget) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelectAlert(alert)
          }
        },
        tabIndex: 0,
        'aria-label': `Select alert ${alert.title}`,
        className: 'cursor-pointer',
      })}
    />
  )
}
