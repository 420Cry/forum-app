import { describe, expect, it } from 'vitest'
import { isProfileCacheStale } from '~/utils/profileCache'

describe('isProfileCacheStale', () => {
  it('returns false when cache is empty', () => {
    expect(isProfileCacheStale(null, 'user-a')).toBe(false)
    expect(isProfileCacheStale(undefined, 'user-a')).toBe(false)
  })

  it('returns false when cache matches the auth user', () => {
    expect(isProfileCacheStale('user-a', 'user-a')).toBe(false)
  })

  it('returns true when cache belongs to another user', () => {
    expect(isProfileCacheStale('user-a', 'user-b')).toBe(true)
  })
})
