import type { ComponentType } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import {
  AlertsPlaceholder,
  NotFoundPage,
  RootLayout,
  RootRedirect,
  RouteErrorPage,
} from './route-elements'

export function createAppRoutes(
  AlertsPage: ComponentType = AlertsPlaceholder,
  additionalRoutes: RouteObject[] = [],
): RouteObject[] {
  return [
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        { index: true, element: <RootRedirect /> },
        { path: 'alerts', element: <AlertsPage /> },
        ...additionalRoutes,
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]
}

export const router = createBrowserRouter(createAppRoutes())
