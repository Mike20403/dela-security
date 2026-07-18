import { describe, expect, it } from 'vitest'
import { AppError, normalizeError } from './AppError'

describe('normalizeError', () => {
  it('preserves application errors', () => {
    const error = new AppError('NETWORK', 'Connection unavailable.', {
      retryable: true,
    })

    expect(normalizeError(error)).toBe(error)
  })

  it.each([new Error('database password leaked'), 'unsafe detail', null])(
    'normalizes unknown value %p to one safe error',
    (value) => {
      const error = normalizeError(value)

      expect(error).toMatchObject({
        code: 'UNKNOWN',
        message: 'Something went wrong. Please try again.',
        retryable: false,
      })
      expect(error.cause).toBe(value)
      expect(error.message).not.toContain('password')
      expect(error.message).not.toContain('unsafe')
    },
  )
})
