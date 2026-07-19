import { StyleProvider } from '@ant-design/cssinjs'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App as AntApp, ConfigProvider } from 'antd'
import { RouterProvider, type RouterProviderProps } from 'react-router-dom'
import { antdTheme } from '../core/theme/antd-theme'
import { AppErrorBoundary } from './AppErrorBoundary'
import { WebSocketProvider } from './websocket/WebSocketContext'

interface ApplicationProvidersProps {
  queryClient: QueryClient
  router: RouterProviderProps['router']
}

export function ApplicationProviders({
  queryClient,
  router,
}: ApplicationProvidersProps) {
  return (
    <AppErrorBoundary>
      <StyleProvider layer>
        <ConfigProvider theme={antdTheme}>
          <AntApp>
            <QueryClientProvider client={queryClient}>
              <WebSocketProvider>
                <RouterProvider
                  router={router}
                  future={{ v7_startTransition: true }}
                />
              </WebSocketProvider>
            </QueryClientProvider>
          </AntApp>
        </ConfigProvider>
      </StyleProvider>
    </AppErrorBoundary>
  )
}
