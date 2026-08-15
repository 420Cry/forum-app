import { describe, expect, it } from 'vitest'
import {
  hasAccessToken,
  isDuplicateSignupUser,
  isEmailVerified,
  isFetchUnauthorized,
  isSignupUserAlreadyExistsError,
  isTokenExpiring,
  resolveAuthUser,
  TOKEN_REFRESH_MARGIN_MS,
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
      const sessionUser = { id: 'session' }
      const session = { user: sessionUser } as never

      expect(resolveAuthUser(composable, session)).toEqual(composable)
      expect(resolveAuthUser(null, session)).toEqual(sessionUser)
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

  describe('isSignupUserAlreadyExistsError', () => {
    it('detects Supabase duplicate signup errors', () => {
      expect(isSignupUserAlreadyExistsError({ code: 'user_already_exists' })).toBe(true)
      expect(
        isSignupUserAlreadyExistsError({ message: 'User already registered' }),
      ).toBe(true)
      expect(isSignupUserAlreadyExistsError({ message: 'Invalid login' })).toBe(false)
    })
  })

  describe('isDuplicateSignupUser', () => {
    it('detects obfuscated users returned for existing emails', () => {
      expect(isDuplicateSignupUser({ identities: [] } as never)).toBe(true)
      expect(
        isDuplicateSignupUser({ identities: [{ provider: 'email' }] } as never),
      ).toBe(false)
      expect(isDuplicateSignupUser(null)).toBe(false)
    })
  })

  describe('isTokenExpiring', () => {
    const now = 1_700_000_000_000
    const secondsFromNow = (ms: number) => (now + ms) / 1000

    it('is true within the refresh margin and after expiry', () => {
      expect(isTokenExpiring(secondsFromNow(30_000), now)).toBe(true)
      expect(isTokenExpiring(secondsFromNow(-5_000), now)).toBe(true)
      expect(isTokenExpiring(secondsFromNow(TOKEN_REFRESH_MARGIN_MS), now)).toBe(
        true,
      )
    })

    it('is false for a fresh token or unknown expiry', () => {
      expect(isTokenExpiring(secondsFromNow(10 * 60_000), now)).toBe(false)
      expect(isTokenExpiring(undefined, now)).toBe(false)
      expect(isTokenExpiring(null, now)).toBe(false)
    })
  })

  describe('isEmailVerified', () => {
    it('checks email_confirmed_at on the user', () => {
      expect(isEmailVerified({ email_confirmed_at: '2024-01-01' })).toBe(true)
      expect(isEmailVerified({ email_confirmed_at: null })).toBe(false)
      expect(isEmailVerified(null)).toBe(false)
    })
  })
})
