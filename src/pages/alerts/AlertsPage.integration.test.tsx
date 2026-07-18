import { App } from 'antd'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { render } from '../../test/render'
import { server } from '../../test/msw-server'
import { AlertsPage } from './AlertsPage'
import { API_PATHS } from './api/api-paths'
import { mockAlerts } from './api/mock-alerts'

describe('AlertsPage filter integration', () => {
  it('combines severity and category filters, updates counts/stats/table, resets pagination and all filters', async () => {
    const user = userEvent.setup()
    render(
      <App>
        <AlertsPage />
      </App>,
    )
    expect(await screen.findByText(mockAlerts[0]!.title)).toBeVisible()

    await user.click(screen.getByTitle('2'))
    expect(screen.getByText(mockAlerts[15]!.title)).toBeVisible()

    await user.click(screen.getByRole('combobox', { name: 'Severity' }))
    await user.click(screen.getByTitle('Critical'))
    await user.click(screen.getByRole('combobox', { name: 'Category' }))
    await user.click(screen.getByTitle('Credential Access'))
    await user.click(screen.getByRole('button', { name: 'Apply filters' }))

    expect(screen.getByRole('tab', { name: 'All 3' })).toBeVisible()
    expect(screen.getByLabelText('Total alerts')).toHaveTextContent('3')
    expect(screen.getByText(mockAlerts[0]!.title)).toBeVisible()
    expect(screen.queryByText(mockAlerts[15]!.title)).toBeNull()
    expect(screen.queryByTitle('2')).toBeNull()
    expect(screen.getByText('2 active filters')).toBeVisible()

    await user.click(screen.getByRole('tab', { name: 'Open 3' }))
    expect(screen.getByLabelText('Total alerts')).toHaveTextContent('3')
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(screen.getByRole('tab', { name: 'All 32' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByLabelText('Total alerts')).toHaveTextContent('32')
    expect(screen.queryByText(/active filters?/)).toBeNull()
  }, 15_000)

  it('opens drawer by ID and reflects optimistic status and assignment in drawer and table', async () => {
    const user = userEvent.setup()
    render(
      <App>
        <AlertsPage />
      </App>,
    )
    const title = mockAlerts[0]!.title
    const row = await screen.findByRole('row', {
      name: `Select alert ${title}`,
    })
    await user.click(within(row).getByRole('button', { name: `View ${title}` }))
    expect(screen.getByRole('dialog')).toHaveTextContent(mockAlerts[0]!.id)

    await user.click(screen.getByRole('combobox', { name: 'Alert status' }))
    await user.click(screen.getByRole('option', { name: 'Resolved' }))
    expect(within(row).getByText('Resolved')).toBeVisible()
    expect(
      screen.getByRole('combobox', { name: 'Alert status' }),
    ).toBeDisabled()
    await waitFor(() =>
      expect(
        screen.getByRole('combobox', { name: 'Alert status' }),
      ).not.toBeDisabled(),
    )

    await user.click(screen.getByText('Assign to me').closest('button')!)
    expect(screen.getByText('Alex Morgan')).toBeVisible()
  }, 15_000)

  it('rolls back a failed optimistic status update and hides repository error details', async () => {
    const user = userEvent.setup()
    let rejectUpdate!: () => void
    const updateRejected = new Promise<void>((resolve) => {
      rejectUpdate = resolve
    })
    const secret = 'repository-secret: database shard alpha unavailable'
    server.use(
      http.patch(
        `${API_PATHS.alerts}/:id`,
        async () => {
          await updateRejected
          return HttpResponse.json({ error: secret }, { status: 500 })
        },
        { once: true },
      ),
    )
    render(
      <App>
        <AlertsPage />
      </App>,
    )
    const title = mockAlerts[0]!.title
    const row = await screen.findByRole('row', {
      name: `Select alert ${title}`,
    })
    await user.click(within(row).getByRole('button', { name: `View ${title}` }))

    await user.click(screen.getByRole('combobox', { name: 'Alert status' }))
    await user.click(screen.getByRole('option', { name: 'Resolved' }))
    expect(within(row).getByText('Resolved')).toBeVisible()
    expect(
      screen
        .getByRole('combobox', { name: 'Alert status' })
        .closest('.ant-select'),
    ).toHaveTextContent('Resolved')

    rejectUpdate()
    expect(await within(row).findByText('Open')).toBeVisible()
    expect(
      screen
        .getByRole('combobox', { name: 'Alert status' })
        .closest('.ant-select'),
    ).toHaveTextContent('Open')
    expect(await screen.findByText(/Change reverted/)).toBeVisible()
    expect(screen.queryByText(secret)).toBeNull()
  }, 15_000)
})
