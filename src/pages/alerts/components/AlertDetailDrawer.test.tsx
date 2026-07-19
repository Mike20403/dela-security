import { App } from 'antd'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { SecurityAlert } from '../../../core/types/alerts'
import { AlertDetailDrawer } from './AlertDetailDrawer'

const alert: SecurityAlert = {
  id: 'alert-1',
  title: 'Golden Ticket detected',
  severity: 'critical',
  status: 'open',
  category: 'Persistence',
  affectedAsset: 'KRBTGT',
  domainController: 'DC01.example.com',
  detectedAt: '2026-07-18T12:00:00Z',
  description: 'Ticket anomaly details',
  recommendedAction: 'Rotate credentials',
}

function renderDrawer(
  onClose = vi.fn(),
  changes: Partial<ComponentProps<typeof AlertDetailDrawer>> = {},
) {
  render(
    <App>
      <AlertDetailDrawer
        alert={alert}
        open
        onClose={onClose}
        pending={false}
        onStatusChange={vi.fn()}
        onAssignToMe={vi.fn()}
        {...changes}
      />
    </App>,
  )
  return onClose
}

describe('AlertDetailDrawer', () => {
  it('renders every field and safe missing assignment', () => {
    renderDrawer()
    for (const value of [
      alert.id,
      alert.title,
      'Critical',
      'Open',
      alert.category,
      alert.affectedAsset,
      alert.domainController,
      alert.description,
      alert.recommendedAction,
      'Unassigned',
    ]) {
      expect(screen.getByText(value)).toBeVisible()
    }
  })

  it('closes on Escape', async () => {
    const onClose = renderDrawer()
    fireEvent.keyDown(screen.getByRole('dialog').closest('.ant-drawer')!, {
      key: 'Escape',
      keyCode: 27,
    })
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce())
  })

  it('shows date fallback, all status choices, and dispatches actions', async () => {
    const user = userEvent.setup()
    const onStatusChange = vi.fn()
    const onAssignToMe = vi.fn()
    renderDrawer(vi.fn(), {
      alert: { ...alert, detectedAt: 'invalid' },
      onStatusChange,
      onAssignToMe,
    })
    expect(screen.getByText('—')).toBeVisible()

    await user.click(screen.getByRole('combobox', { name: 'Alert status' }))
    for (const option of ['Open', 'In Review', 'Resolved', 'Suppressed']) {
      expect(screen.getByRole('option', { name: option })).toBeInTheDocument()
    }
    await user.click(screen.getByRole('option', { name: 'Resolved' }))
    expect(onStatusChange).toHaveBeenCalledWith('resolved', expect.anything())
    await user.click(screen.getByRole('button', { name: 'Assign to me' }))
    expect(onAssignToMe).toHaveBeenCalledOnce()
  })

  it('disables actions while pending', () => {
    renderDrawer(vi.fn(), { pending: true })
    expect(
      screen.getByRole('combobox', { name: 'Alert status' }),
    ).toBeDisabled()
    expect(screen.getByText('Assign to me').closest('button')).toBeDisabled()
  })

  it('caps drawer width at the viewport for narrow layouts', () => {
    renderDrawer()

    expect(
      screen.getByRole('dialog').closest('.ant-drawer-content-wrapper'),
    ).toHaveStyle({
      width: 'min(40rem, 100vw)',
    })
  })

  it('groups content into labeled sections', () => {
    renderDrawer()

    for (const heading of [
      'Overview',
      'Detection context',
      'Ownership and status',
      'Analysis',
      'Recommended action',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeVisible()
    }
  })
})
