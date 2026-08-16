import { describe, expect, it } from 'vitest'
import { isSendbirdSessionFresh } from '~/composables/chat/useSendbirdClient'

describe('isSendbirdSessionFresh', () => {
  it('is fresh when expiresAt is beyond the skew window', () => {
    const now = 1_000_000
    expect(isSendbirdSessionFresh(now + 120_000, now, 60_000)).toBe(true)
  })

  it('is stale inside the skew window or when expired', () => {
    const now = 1_000_000
    expect(isSendbirdSessionFresh(now + 30_000, now, 60_000)).toBe(false)
    expect(isSendbirdSessionFresh(now - 1, now, 60_000)).toBe(false)
    expect(isSendbirdSessionFresh(Number.NaN, now, 60_000)).toBe(false)
  })
})
