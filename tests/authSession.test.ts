import { describe, expect, it } from 'vitest'
import {
  hasAccessToken,
  isFetchUnauthorized,
  resolveAuthUser,
} from '~/utils/authSession'

describe('authSession', () => {
  describe('hasAccessToken', () => {
    it('returns false without a session token', () => {
      expect(hasAccessToken(null)).toBe(false)
      expect(hasAccessToken({} as never)).toBe(false)
    })

    it('returns true when access_token exists', () => {
      expect(
        hasAccessToken({ access_token: 'token-123' } as never),
      ).toBe(true)
    })
  })

  describe('resolveAuthUser', () => {
    it('prefers fetched user over composable user and session', () => {
      const fetched = { id: 'fetched' } as never
      const composable = { id: 'composable' } as never
      const session = { user: { id: 'session' } } as never

      expect(resolveAuthUser(composable, session, fetched)).toBe(fetched)
    })

    it('falls back to composable user then session user', () => {
      const composable = { id: 'composable' } as never
      const session = { user: { id: 'session' } } as never

      expect(resolveAuthUser(composable, session)).toEqual(composable)
      expect(resolveAuthUser(null, session)).toEqual(session.user)
    })
  })

  describe('isFetchUnauthorized', () => {
    it('detects 401 from status or statusCode', () => {
      expect(isFetchUnauthorized({ status: 401 })).toBe(true)
      expect(isFetchUnauthorized({ statusCode: 401 })).toBe(true)
      expect(isFetchUnauthorized({ status: 500 })).toBe(false)
      expect(isFetchUnauthorized(null)).toBe(false)
    })
  })
})
