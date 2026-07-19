import {
  isRouteErrorResponse,
  Navigate,
  Outlet,
  useRouteError,
} from 'react-router-dom'
import { AppError, normalizeError } from '../core/errors/AppError'

export function RootRedirect() {
  return <Navigate to="/alerts" replace />
}

export function RootLayout() {
  return <Outlet />
}

export function NotFoundPage() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
    </main>
  )
}

export function RouteErrorPage() {
  const routeError = useRouteError()
  const error = isRouteErrorResponse(routeError)
    ? new AppError(
        routeError.status === 404 ? 'NOT_FOUND' : 'UNKNOWN',
        routeError.status === 404
          ? 'The requested page does not exist.'
          : 'Something went wrong. Please try again.',
      )
    : normalizeError(routeError)

  return (
    <main role="alert">
      <h1>Unable to load page</h1>
      <p>{error.message}</p>
    </main>
  )
}
