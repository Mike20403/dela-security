import type { ComponentType } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { AlertsPage } from '../pages/alerts/AlertsPage'
import {
  NotFoundPage,
  RootLayout,
  RootRedirect,
  RouteErrorPage,
} from './route-elements'

export function createAppRoutes(
  AlertsPageComponent: ComponentType = AlertsPage,
  additionalRoutes: RouteObject[] = [],
): RouteObject[] {
  return [
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        { index: true, element: <RootRedirect /> },
        { path: 'alerts', element: <AlertsPageComponent /> },
        ...additionalRoutes,
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ]
}

export const router = createBrowserRouter(createAppRoutes())
