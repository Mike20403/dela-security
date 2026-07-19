import { screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { render } from '../test/render'
import { Logo } from './Logo'

it('renders an accessible logo mark with default size', () => {
  render(<Logo />)

  const svg = screen.getByRole('img', { name: 'DELA Security logo' })
  expect(svg.getAttribute('width')).toBe('28')
  expect(svg.getAttribute('height')).toBe('28')
})

it('reflects a custom size prop in width/height', () => {
  render(<Logo size={48} />)

  const svg = screen.getByRole('img', { name: 'DELA Security logo' })
  expect(svg.getAttribute('width')).toBe('48')
  expect(svg.getAttribute('height')).toBe('48')
})
