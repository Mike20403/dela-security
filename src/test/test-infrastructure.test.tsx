import { useQueryClient } from '@tanstack/react-query'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { createTestQueryClient } from './query-client'
import { render } from './render'

function ProviderProbe() {
  const queryClient = useQueryClient()
  const [count, setCount] = useState(0)

  return (
    <button type="button" onClick={() => setCount((value) => value + 1)}>
      {queryClient.getQueryData(['message']) ?? `Clicks: ${count}`}
    </button>
  )
}

describe('test infrastructure', () => {
  it('loads DOM matchers and renders with fresh providers', async () => {
    const user = userEvent.setup()

    render(<ProviderProbe />)

    const button = screen.getByRole('button', { name: 'Clicks: 0' })
    expect(button).toBeInTheDocument()

    await user.click(button)
    expect(button).toHaveTextContent('Clicks: 1')
  })

  it('isolates QueryClient caches', () => {
    const firstClient = createTestQueryClient()
    const secondClient = createTestQueryClient()

    firstClient.setQueryData(['message'], 'cached')

    expect(firstClient.getQueryData(['message'])).toBe('cached')
    expect(secondClient.getQueryData(['message'])).toBeUndefined()
  })

  it('accepts an explicit QueryClient', () => {
    const queryClient = createTestQueryClient()
    queryClient.setQueryData(['message'], 'provided cache')

    render(<ProviderProbe />, { queryClient })

    expect(
      screen.getByRole('button', { name: 'provided cache' }),
    ).toBeInTheDocument()
  })
})
