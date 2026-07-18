import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockAlerts } from './api/mock-alerts'
import { AlertsPage } from './AlertsPage'
import { useAlerts } from './hooks/useAlerts'

vi.mock('./hooks/useAlerts', () => ({ useAlerts: vi.fn() }))

const mockedUseAlerts = vi.mocked(useAlerts)

describe('AlertsPage', () => {
  beforeEach(() => mockedUseAlerts.mockReset())

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
})
