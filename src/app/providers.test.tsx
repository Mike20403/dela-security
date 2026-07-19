import { QueryClient } from '@tanstack/react-query'
import { createMemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { render } from '../test/render'
import { ApplicationProviders } from './providers'

function renderProviders() {
  const router = createMemoryRouter([
    { path: '/', element: <p>Page content</p> },
  ])
  return render(
    <ApplicationProviders queryClient={new QueryClient()} router={router} />,
  )
}

describe('ApplicationProviders', () => {
  it('encapsulates Ant Design styles inside a layered stylesheet so Tailwind utilities can override them', () => {
    renderProviders()

    const layeredAntStyle = Array.from(document.querySelectorAll('style')).find(
      (style) => /@layer\s+[\w-]*antd/.test(style.textContent ?? ''),
    )

    expect(layeredAntStyle).toBeDefined()
  })
})
