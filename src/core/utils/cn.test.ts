import { describe, expect, it } from 'vitest'
import { cn } from '../utils/cn.ts'

describe('cn', () => {
  it('combines conditional classes and keeps the last conflicting utility', () => {
    expect(cn('px-2 text-sm', null, ['px-4'], { block: true })).toBe(
      'text-sm px-4 block',
    )
  })
})
