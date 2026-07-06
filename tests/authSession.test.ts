import { describe, expect, it } from 'vitest'
import {
  hasAccessToken,
  isEmailVerified,
  isFetchUnauthorized,
  resolveAuthUser,
} from '~/utils/authSession'

describe('authSession', () => {
  describe('isEmailVerified', () => {
    it('returns false for nullish or non-object values', () => {
      expect(isEmailVerified(null)).toBe(false)
      expect(isEmailVerified(undefined)).toBe(false)
      expect(isEmailVerified('user')).toBe(false)
    })

    it('returns true when email_confirmed_at is set', () => {
      expect(
        isEmailVerified({ email_confirmed_at: '2026-07-06T00:00:00.000Z' }),
      ).toBe(true)
    })
  })

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
