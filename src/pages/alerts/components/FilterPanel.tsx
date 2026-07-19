import { Badge, Button, DatePicker, Input, Select } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { AlertFilters } from '../alert-filter-schema'
import { countActiveFilters } from '../alert-filters'
import { severityOptions, severityPresentation } from '../alert-presentation'

interface FilterPanelProps {
  form: UseFormReturn<AlertFilters>
  filters: AlertFilters
  categories: readonly string[]
  onApply: () => void
  onReset: () => void
}

dayjs.extend(customParseFormat)

export function FilterPanel({
  form,
  filters,
  categories,
  onApply,
  onReset,
}: FilterPanelProps) {
  const activeCount = countActiveFilters(filters)

  return (
    <form
      className="border-border-default bg-background-surface grid w-full min-w-0 grid-cols-1 items-end gap-sm rounded-md border p-md sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1fr)_12rem_minmax(16rem,20rem)] 2xl:grid-cols-[minmax(14rem,1fr)_12rem_minmax(16rem,20rem)_minmax(20rem,auto)_auto]"
      aria-label="Alert filters"
      onSubmit={(event) => {
        event.preventDefault()
        onApply()
      }}
    >
      <label className="w-full min-w-0 text-sm sm:col-span-2 lg:col-span-1">
        <span className="text-foreground-muted mb-xs block">Search</span>
        <Controller
          name="search"
          control={form.control}
          render={({ field }) => (
            <Input.Search
              {...field}
              aria-label="Search alerts"
              allowClear
              placeholder="Title or affected asset"
              onSearch={onApply}
            />
          )}
        />
      </label>
      <label className="w-full min-w-0 text-sm sm:min-w-48">
        <span className="text-foreground-muted mb-xs block">Severity</span>
        <Controller
          name="severities"
          control={form.control}
          render={({ field }) => (
            <Select
              {...field}
              aria-label="Severity"
              className="w-full"
              mode="multiple"
              maxTagCount="responsive"
              options={severityOptions}
              placeholder="All severities"
            />
          )}
        />
      </label>
      <label className="w-full min-w-0 text-sm sm:min-w-64">
        <span className="text-foreground-muted mb-xs block">Category</span>
        <Controller
          name="categories"
          control={form.control}
          render={({ field }) => (
            <Select
              {...field}
              aria-label="Category"
              className="w-full"
              mode="multiple"
              maxTagCount="responsive"
              options={categories.map((value) => ({ value, label: value }))}
              placeholder="All categories"
            />
          )}
        />
      </label>
      <label className="w-full min-w-0 text-sm sm:col-span-2 lg:col-span-1">
        <span className="text-foreground-muted mb-xs block">Detected date</span>
        <Controller
          name="dateRange"
          control={form.control}
          render={({ field, fieldState }) => (
            <DatePicker.RangePicker
              aria-label="Detected date range"
              className="w-full"
              aria-describedby={
                fieldState.error ? 'date-range-error' : undefined
              }
              aria-invalid={Boolean(fieldState.error)}
              status={fieldState.error ? 'error' : ''}
              value={
                field.value
                  ? [
                      dayjs(field.value[0], 'YYYY-MM-DD', true),
                      dayjs(field.value[1], 'YYYY-MM-DD', true),
                    ]
                  : null
              }
              onBlur={field.onBlur}
              onChange={(value: [Dayjs | null, Dayjs | null] | null) =>
                field.onChange(
                  value?.[0] && value[1]
                    ? [
                        value[0].format('YYYY-MM-DD'),
                        value[1].format('YYYY-MM-DD'),
                      ]
                    : null,
                )
              }
            />
          )}
        />
        {form.formState.errors.dateRange && (
          <span
            id="date-range-error"
            role="alert"
            className={`${severityPresentation.critical.textClassName} mt-xs block`}
          >
            {form.formState.errors.dateRange.message}
          </span>
        )}
      </label>
      <div className="flex w-full flex-wrap items-center gap-sm sm:col-span-2 lg:col-span-3 2xl:col-span-1 2xl:w-auto 2xl:flex-nowrap">
        <Button type="primary" htmlType="submit" aria-label="Apply filters">
          Apply
        </Button>
        <Button onClick={onReset} aria-label="Reset filters">
          Reset
        </Button>
        {activeCount > 0 && (
          <Badge
            count={`${activeCount} active filter${activeCount === 1 ? '' : 's'}`}
            color="blue"
          />
        )}
      </div>
    </form>
  )
}
