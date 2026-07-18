import { useQueryClient } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { App as AntApp } from 'antd'
import { createMemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { createTestQueryClient } from '../test/query-client'
import { ApplicationProviders } from './providers'
import { createAppRoutes } from './router'

function renderRoute(path: string, routes = createAppRoutes()) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <ApplicationProviders
      queryClient={createTestQueryClient()}
      router={router}
    />,
  )
}

describe('application routing', () => {
  it('redirects / to /alerts with replace semantics', async () => {
    const router = createMemoryRouter(createAppRoutes(), {
      initialEntries: ['/previous', '/'],
      initialIndex: 1,
    })

    render(
      <ApplicationProviders
        queryClient={createTestQueryClient()}
        router={router}
      />,
    )

    expect(
      await screen.findByRole('heading', { name: 'Security alerts' }),
    ).toBeVisible()
    expect(router.state.location.pathname).toBe('/alerts')
    expect(router.state.historyAction).toBe('REPLACE')
  })

  it('renders /alerts through full provider hierarchy', async () => {
    const router = createMemoryRouter(
      createAppRoutes(() => {
        const antContext = AntApp.useApp()
        const queryClient = useQueryClient()
        return (
          <h1>
            {antContext.message && queryClient ? 'Security alerts' : 'Missing'}
          </h1>
        )
      }),
      { initialEntries: ['/alerts'] },
    )

    render(
      <ApplicationProviders
        queryClient={createTestQueryClient()}
        router={router}
      />,
    )

    expect(
      await screen.findByRole('heading', { name: 'Security alerts' }),
    ).toBeVisible()
  })

  it('shows a meaningful page for unknown routes', async () => {
    renderRoute('/missing')

    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeVisible()
  })

  it('normalizes thrown route errors without exposing details', async () => {
    renderRoute(
      '/broken',
      createAppRoutes(undefined, [
        {
          path: '/broken',
          loader: () => {
            throw new Error('internal token leaked')
          },
          element: <p>never rendered</p>,
        },
      ]),
    )

    await waitFor(() => expect(screen.getByRole('alert')).toBeVisible())
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong. Please try again.',
    )
    expect(screen.queryByText(/internal token leaked/i)).not.toBeInTheDocument()
  })
})
