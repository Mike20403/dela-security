import { screen } from '@testing-library/react'
import { createMemoryRouter, type RouterProviderProps } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { render } from '../test/render'
import { App } from './App'
import { createAppQueryClient } from './query-client'
import { createAppRoutes } from './router'

const suppressExpectedRenderError = (event: ErrorEvent) =>
  event.preventDefault()

afterEach(() => {
  window.removeEventListener('error', suppressExpectedRenderError)
  vi.restoreAllMocks()
})

it('renders application providers at /alerts', async () => {
  const router = createMemoryRouter(createAppRoutes(), {
    initialEntries: ['/alerts'],
  })

  render(<App router={router} queryClient={createAppQueryClient()} />)

  expect(
    await screen.findByRole('heading', { name: 'Security alerts' }),
  ).toBeVisible()
})

it('catches provider composition render failures above the router', () => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
  window.addEventListener('error', suppressExpectedRenderError)
  const brokenRouter = {
    get state() {
      throw new Error('secret router initialization detail')
    },
  } as unknown as RouterProviderProps['router']

  render(<App router={brokenRouter} queryClient={createAppQueryClient()} />)

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Something went wrong. Please try again.',
  )
  expect(
    screen.queryByText(/secret router initialization detail/i),
  ).not.toBeInTheDocument()
})
