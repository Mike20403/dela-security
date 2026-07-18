import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  render as testingLibraryRender,
  type RenderOptions,
} from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { createTestQueryClient } from './query-client'

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

export function render(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    ...options
  }: CustomRenderOptions = {},
) {
  function Providers({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  return {
    queryClient,
    ...testingLibraryRender(ui, { wrapper: Providers, ...options }),
  }
}
