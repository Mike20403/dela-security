import { Badge, Tabs } from 'antd'
import type { ReactNode } from 'react'

export interface TabNavigationItem<Id extends string> {
  id: Id
  label: ReactNode
  disabled?: boolean
  badge?: number
}

interface TabNavigationProps<Id extends string> {
  items: readonly TabNavigationItem<Id>[]
  activeId: Id
  onChange: (id: Id) => void
}

export function TabNavigation<Id extends string>({
  items,
  activeId,
  onChange,
}: TabNavigationProps<Id>) {
  return (
    <Tabs
      activeKey={activeId}
      onChange={(id) => onChange(id as Id)}
      items={items.map(({ id, label, disabled, badge }) => ({
        key: id,
        ...(disabled === undefined ? {} : { disabled }),
        label:
          badge === undefined ? (
            label
          ) : (
            <span
              className="inline-flex items-center gap-sm"
              aria-label={
                typeof label === 'string' ? `${label} ${badge}` : undefined
              }
            >
              {label}
              <Badge count={badge} showZero overflowCount={999} />
            </span>
          ),
      }))}
    />
  )
}
