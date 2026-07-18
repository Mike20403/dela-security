import { Component, type ErrorInfo, type ReactNode } from 'react'
import { normalizeError } from '../core/errors/AppError'

interface AppErrorBoundaryProps {
  children: ReactNode
  reload?: () => void
}

interface AppErrorBoundaryState {
  errorMessage: string | null
}

export function logRenderError(
  isDevelopment: boolean,
  error: unknown,
  info: Pick<ErrorInfo, 'componentStack'>,
) {
  if (isDevelopment) {
    console.error('Application render failed', error, info.componentStack)
  }
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { errorMessage: null }

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return { errorMessage: normalizeError(error).message }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    logRenderError(import.meta.env.DEV, error, info)
  }

  render() {
    if (this.state.errorMessage) {
      return (
        <main role="alert">
          <h1>Unable to display application</h1>
          <p>{this.state.errorMessage}</p>
          {/* ponytail: Reload-only recovery ceiling; add state reset when safe in-app recovery exists. */}
          <button
            type="button"
            onClick={this.props.reload ?? (() => window.location.reload())}
          >
            Reload page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
