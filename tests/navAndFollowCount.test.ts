import { describe, expect, it } from 'vitest'
import { adjustFollowCount } from '~/utils/followCount'
import { isNavPathActive } from '~/utils/navActive'

describe('adjustFollowCount', () => {
  it('increments and decrements without going negative', () => {
    expect(adjustFollowCount(2, true)).toBe(3)
    expect(adjustFollowCount(2, false)).toBe(1)
    expect(adjustFollowCount(0, false)).toBe(0)
    expect(adjustFollowCount(undefined, true)).toBe(1)
  })
})

describe('isNavPathActive', () => {
  it('matches exact and nested paths', () => {
    expect(isNavPathActive('/en/settings', '/en/settings')).toBe(true)
    expect(isNavPathActive('/en/settings/profile', '/en/settings')).toBe(true)
    expect(isNavPathActive('/en/social', '/en/settings')).toBe(false)
    expect(isNavPathActive('/en/find/', '/en/find')).toBe(true)
  })
})
