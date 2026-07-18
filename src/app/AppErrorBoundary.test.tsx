import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppErrorBoundary, logRenderError } from './AppErrorBoundary'

function ThrowingChild(): never {
  throw new Error('secret rendering detail')
}

function suppressExpectedRenderError(event: ErrorEvent) {
  if (event.error instanceof Error && event.error.message.includes('secret')) {
    event.preventDefault()
  }
}

describe('AppErrorBoundary', () => {
  beforeEach(() =>
    window.addEventListener('error', suppressExpectedRenderError),
  )
  afterEach(() => {
    window.removeEventListener('error', suppressExpectedRenderError)
    vi.restoreAllMocks()
  })

  it('replaces render failures with safe recovery UI', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    render(
      <AppErrorBoundary>
        <ThrowingChild />
      </AppErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong. Please try again.',
    )
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeVisible()
    expect(
      screen.queryByText(/secret rendering detail/i),
    ).not.toBeInTheDocument()
  })

  it('runs the injected reload recovery action', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const reload = vi.fn()

    render(
      <AppErrorBoundary reload={reload}>
        <ThrowingChild />
      </AppErrorBoundary>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Reload page' }))

    expect(reload).toHaveBeenCalledOnce()
  })

  it('does not log raw render details outside development', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    const error = new Error('production secret')

    logRenderError(false, error, { componentStack: '\n at SecretView' })

    expect(consoleError).not.toHaveBeenCalled()
  })

  it('logs render details during development', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    const error = new Error('development detail')

    logRenderError(true, error, { componentStack: '\n at BrokenView' })

    expect(consoleError).toHaveBeenCalledWith(
      'Application render failed',
      error,
      '\n at BrokenView',
    )
  })
})
