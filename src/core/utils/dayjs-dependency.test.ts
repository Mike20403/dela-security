import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import packageJson from '../../../package.json'

describe('dayjs dependency', () => {
  it('pins the Ant-compatible version to one lockfile resolution', () => {
    const lockfile = readFileSync('yarn.lock', 'utf8')
    const resolutions = lockfile.match(/^[ ]{2}resolution: "dayjs@npm:/gm) ?? []

    expect(packageJson.dependencies.dayjs).toBe('1.11.21')
    expect(resolutions).toHaveLength(1)
  })
})
