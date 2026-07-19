import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '../../test/render'
import { mockAlerts } from './api/mock-alerts'
import { AlertsPage } from './AlertsPage'
import { useAlerts } from './hooks/useAlerts'

vi.mock('./hooks/useAlerts', () => ({ useAlerts: vi.fn() }))

const mockedUseAlerts = vi.mocked(useAlerts)

describe('AlertsPage', () => {
  beforeEach(() => mockedUseAlerts.mockReset())

  it('shows workspace landmarks', () => {
    mockedUseAlerts.mockReturnValue({
      isPending: false,
      isError: false,
      data: mockAlerts,
      dataUpdatedAt: Date.parse('2026-07-19T10:00:00Z'),
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAlerts>)
    render(<AlertsPage />)

    expect(
      screen.getByRole('heading', { name: 'Security alerts', level: 2 }),
    ).toBeVisible()
  })

  it('shows monitored directory, mock-data status, last-updated time, and refresh action', async () => {
    const refetch = vi.fn()
    mockedUseAlerts.mockReturnValue({
      isPending: false,
      isError: false,
      data: mockAlerts,
      dataUpdatedAt: Date.parse('2026-07-19T10:00:00Z'),
      refetch,
    } as unknown as ReturnType<typeof useAlerts>)
    render(<AlertsPage />)

    expect(screen.getByLabelText('Monitored directory')).toHaveTextContent(
      /corp\.example\.com/,
    )
    expect(screen.getByText(/mock data/i)).toBeVisible()
    expect(screen.getByLabelText('Last updated')).toHaveTextContent(/Updated/i)

    await userEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('shows a meaningful table-shaped initial skeleton', () => {
    mockedUseAlerts.mockReturnValue({ isPending: true } as ReturnType<
      typeof useAlerts
    >)
    render(<AlertsPage />)

    expect(
      screen.getByRole('status', { name: 'Loading security alerts' }),
    ).toBeVisible()
    expect(screen.getAllByTestId('alert-skeleton-row')).toHaveLength(6)
  })

  it('shows safe error feedback and retries', async () => {
    const refetch = vi.fn()
    mockedUseAlerts.mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error('secret backend detail'),
      refetch,
    } as unknown as ReturnType<typeof useAlerts>)
    render(<AlertsPage />)

    expect(screen.getByText('Unable to load security alerts')).toBeVisible()
    expect(screen.queryByText(/secret backend detail/i)).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('keeps cached alerts visible and offers nonblocking retry after a refetch error', async () => {
    const refetch = vi.fn()
    mockedUseAlerts.mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error('secret backend detail'),
      data: [mockAlerts[0]],
      refetch,
    } as unknown as ReturnType<typeof useAlerts>)
    render(<AlertsPage />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Showing cached alerts because refresh failed.',
    )
    expect(screen.queryByText(/secret backend detail/i)).toBeNull()
    expect(screen.getByText(mockAlerts[0]!.title)).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Retry refresh' }))
    expect(refetch).toHaveBeenCalledOnce()
  })

  it('derives badges, filters tabs, and updates visible summary', async () => {
    mockedUseAlerts.mockReturnValue({
      isPending: false,
      isError: false,
      data: mockAlerts,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAlerts>)
    render(<AlertsPage />)

    expect(
      screen.getByRole('heading', { name: 'Security alerts' }),
    ).toBeVisible()
    expect(screen.getByLabelText('Total alerts')).toHaveTextContent('32')
    expect(screen.getByRole('tab', { name: 'All 32' })).toBeVisible()
    expect(screen.queryByRole('tab', { name: /Suppressed/i })).toBeNull()

    await userEvent.click(screen.getByRole('tab', { name: 'Open 8' }))
    expect(screen.getByLabelText('Total alerts')).toHaveTextContent('8')
    expect(screen.queryByText('Golden Ticket indicators found')).toBeNull()
    expect(
      screen.getByText('DCSync replication requested by non-controller'),
    ).toBeVisible()
  })

  it('applies filters before tab counts and resets filters with All tab', async () => {
    mockedUseAlerts.mockReturnValue({
      isPending: false,
      isError: false,
      data: mockAlerts,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAlerts>)
    render(<AlertsPage />)

    await userEvent.click(screen.getByRole('tab', { name: 'Open 8' }))
    await userEvent.type(
      screen.getByRole('searchbox', { name: 'Search alerts' }),
      'Golden Ticket',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Apply filters' }))

    expect(screen.getByRole('tab', { name: 'All 1' })).toBeVisible()
    expect(screen.getByRole('tab', { name: 'Open 0' })).toBeVisible()
    expect(screen.getByLabelText('Total alerts')).toHaveTextContent('0')
    expect(screen.getByText('1 active filter')).toBeVisible()

    await userEvent.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(screen.getByRole('tab', { name: 'All 32' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByLabelText('Total alerts')).toHaveTextContent('32')
  })

  it('closes an open drawer after loaded data no longer contains its ID', async () => {
    mockedUseAlerts.mockReturnValue({
      isPending: false,
      isError: false,
      data: [mockAlerts[0]],
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAlerts>)
    const { rerender } = render(<AlertsPage />)

    await userEvent.click(
      screen.getByRole('button', { name: `View ${mockAlerts[0]!.title}` }),
    )
    expect(screen.getByRole('dialog')).toBeVisible()

    mockedUseAlerts.mockReturnValue({
      isPending: false,
      isError: false,
      data: [],
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useAlerts>)
    rerender(<AlertsPage />)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(
      screen.getByRole('heading', { name: 'Security alerts' }),
    ).toHaveFocus()
  })
})
