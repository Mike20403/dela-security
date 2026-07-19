import { yupResolver } from '@hookform/resolvers/yup'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'
import {
  alertFilterSchema,
  defaultAlertFilters,
  type AlertFilters,
} from '../alert-filter-schema'
import { FilterPanel } from './FilterPanel'

const longCategory =
  'Cloud Security Posture Management and Runtime Threat Detection'
const categories = ['Cloud Security', 'Identity and Access', longCategory]

function TestFilterPanel({
  onApply = vi.fn(),
  defaultValues = defaultAlertFilters,
}: {
  onApply?: (filters: AlertFilters) => void
  defaultValues?: AlertFilters
}) {
  const form = useForm<AlertFilters>({
    defaultValues,
    resolver: yupResolver(alertFilterSchema, { strict: true }),
  })
  return (
    <>
      <button
        onClick={() => {
          form.setValue('dateRange', ['2026-07-19', '2026-07-18'])
          void form.trigger('dateRange')
        }}
      >
        Set reversed dates
      </button>
      <FilterPanel
        form={form}
        filters={defaultAlertFilters}
        categories={categories}
        onApply={() => void form.handleSubmit(onApply)()}
        onReset={vi.fn()}
      />
    </>
  )
}

describe('FilterPanel', () => {
  it('labels the toolbar with a visible section heading', () => {
    render(<TestFilterPanel />)

    const heading = screen.getByRole('heading', { name: 'Alert filters' })
    expect(heading).toBeVisible()
    expect(heading.className).toMatch(/text-sm|text-base/)
    expect(heading.className).toMatch(/font-semibold|font-bold/)
  })

  it('reopens a controlled date range without crashing the calendar', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(
      <TestFilterPanel
        onApply={onApply}
        defaultValues={{
          ...defaultAlertFilters,
          dateRange: ['2026-07-10', '2026-07-18'],
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Apply filters' }))
    await waitFor(() => expect(onApply).toHaveBeenCalledOnce())
    expect(
      typeof (dayjs('2026-07-10') as unknown as { weekday?: unknown }).weekday,
    ).toBe('function')

    await user.click(
      screen.getAllByLabelText('Detected date range')[0] as HTMLElement,
    )
    await waitFor(() =>
      expect(document.querySelector('.ant-picker-panel')).toBeInTheDocument(),
    )
  })

  it('encodes responsive grid and no-overflow layout contracts', () => {
    render(<TestFilterPanel />)

    const form = screen.getByRole('form', { name: 'Alert filters' })
    expect(form).toHaveClass(
      'w-full',
      'min-w-0',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-[minmax(14rem,1fr)_12rem_minmax(16rem,20rem)]',
      '2xl:grid-cols-[minmax(14rem,1fr)_12rem_minmax(16rem,20rem)_minmax(20rem,auto)_auto]',
    )

    const search = screen.getByText('Search').closest('label')
    const severity = screen.getByText('Severity').closest('label')
    const category = screen.getByText('Category').closest('label')
    const date = screen.getByText('Detected date').closest('label')
    expect(search).toHaveClass(
      'w-full',
      'min-w-0',
      'sm:col-span-2',
      'lg:col-span-1',
    )
    expect(severity).toHaveClass('w-full', 'min-w-0', 'sm:min-w-48')
    expect(category).toHaveClass('w-full', 'min-w-0', 'sm:min-w-64')
    expect(date).toHaveClass(
      'w-full',
      'min-w-0',
      'sm:col-span-2',
      'lg:col-span-1',
    )
    expect(date?.querySelector('.ant-picker')).toHaveClass('w-full')

    const apply = screen.getByRole('button', { name: 'Apply filters' })
    const reset = screen.getByRole('button', { name: 'Reset filters' })
    expect(apply.parentElement).toBe(reset.parentElement)
    expect(apply.parentElement).toHaveClass(
      'w-full',
      'flex-wrap',
      'sm:col-span-2',
      'lg:col-span-3',
      '2xl:col-span-1',
      '2xl:w-auto',
      '2xl:flex-nowrap',
    )
  })

  it('owns full-width severity and category Select roots', () => {
    render(<TestFilterPanel />)

    for (const name of ['Severity', 'Category']) {
      const combobox = screen.getByRole('combobox', { name })
      const selectRoot = combobox.closest('.ant-select')
      expect(selectRoot).toHaveClass('w-full')
      expect(selectRoot).toContainElement(combobox)
    }
  })

  it('keeps long category values represented and submits them unchanged', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(
      <TestFilterPanel
        onApply={onApply}
        defaultValues={{
          ...defaultAlertFilters,
          categories: [longCategory],
        }}
      />,
    )

    const category = screen.getByRole('combobox', { name: 'Category' })
    const categoryRoot = category.closest('.ant-select')
    expect(categoryRoot).not.toBeNull()
    await user.click(category)
    expect(await screen.findByTitle(longCategory)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Apply filters' }))
    await waitFor(() => expect(onApply).toHaveBeenCalledOnce())
    expect(onApply.mock.calls[0]?.[0].categories).toEqual([longCategory])
  })

  it('collapses responsive Select tags when available width is exhausted', async () => {
    render(
      <TestFilterPanel
        defaultValues={{
          ...defaultAlertFilters,
          severities: ['critical', 'high', 'medium', 'low'],
        }}
      />,
    )

    const severity = screen
      .getByRole('combobox', { name: 'Severity' })
      .closest('.ant-select')
    expect(severity).not.toBeNull()
    await waitFor(() =>
      expect(
        within(severity as HTMLElement).getByText('+ 3 ...'),
      ).toBeInTheDocument(),
    )
  })

  it('keeps multiple severity and category values usable when applying', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    render(
      <TestFilterPanel
        onApply={onApply}
        defaultValues={{
          ...defaultAlertFilters,
          severities: ['critical', 'high'],
          categories: ['Cloud Security', 'Identity and Access'],
        }}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Apply filters' }))
    await waitFor(() => expect(onApply).toHaveBeenCalledOnce())
    expect(onApply.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        severities: ['critical', 'high'],
        categories: ['Cloud Security', 'Identity and Access'],
      }),
    )
  })

  it('announces reversed date validation and links invalid control to message', async () => {
    const user = userEvent.setup()
    render(<TestFilterPanel />)
    await user.click(screen.getByRole('button', { name: 'Set reversed dates' }))

    const error = await screen.findByRole('alert')
    expect(error).toHaveTextContent('Start date must be on or before end date.')
    await waitFor(() =>
      expect(screen.getAllByLabelText('Detected date range')).toHaveLength(2),
    )
    for (const input of screen.getAllByLabelText('Detected date range')) {
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', error.id)
    }
  })
})
