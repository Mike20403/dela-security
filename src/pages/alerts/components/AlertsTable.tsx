import { Button, Empty, Table, Tag } from 'antd'
import type { TableColumnsType, TablePaginationConfig } from 'antd'
import { useState } from 'react'
import type {
  AlertSeverity,
  AlertStatus,
  SecurityAlert,
} from '../../../core/types/alerts'
import { formatDetectedAt } from '../alert-derivations'
import { severityPresentation, statusPresentation } from '../alert-presentation'

interface AlertsTableProps {
  alerts: readonly SecurityAlert[]
  onSelectAlert: (alert: SecurityAlert) => void
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
        <Tag
          bordered={false}
          className={severityPresentation[severity].className}
        >
          {severityPresentation[severity].label}
        </Tag>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 280,
      rowScope: 'row',
      render: (title: string) => <span className="font-semibold">{title}</span>,
    },
    { title: 'Category', dataIndex: 'category', width: 160 },
    {
      title: 'Affected Asset',
      dataIndex: 'affectedAsset',
      width: 170,
      render: (value: string) => <span className="font-mono">{value}</span>,
    },
    {
      title: 'Domain Controller',
      dataIndex: 'domainController',
      width: 210,
      render: (value: string) => <span className="font-mono">{value}</span>,
    },
    {
      title: (
        <span aria-label="Detected">
          Detected <span aria-hidden="true">(UTC)</span>
        </span>
      ),
      dataIndex: 'detectedAt',
      width: 190,
      render: (value: string) => formatDetectedAt(value),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (status: AlertStatus) => (
        <Tag bordered={false} className={statusPresentation[status].className}>
          {statusPresentation[status].label}
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
    <div className="sticky-header-scope">
      <p className="text-foreground-muted mb-xs text-xs">
        Showing {alerts.length} alert{alerts.length === 1 ? '' : 's'}
      </p>
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
    </div>
  )
}
