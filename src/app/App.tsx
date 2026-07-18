import type { QueryClient } from '@tanstack/react-query'
import type { RouterProviderProps } from 'react-router-dom'
import { ApplicationProviders } from './providers'
import { queryClient as productionQueryClient } from './query-client'
import { router as browserRouter } from './router'

interface AppProps {
  queryClient?: QueryClient
  router?: RouterProviderProps['router']
}

export function App({
  queryClient = productionQueryClient,
  router = browserRouter,
}: AppProps) {
  return <ApplicationProviders queryClient={queryClient} router={router} />
}
