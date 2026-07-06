import { describe, expect, it } from 'vitest'
import {
  getAuthCallbackQuery,
  isEmailOtpType,
  mergeAuthCallbackParams,
  parseHashAuthParams,
} from '~/utils/supabaseAuthCallback'

describe('supabaseAuthCallback', () => {
  describe('isEmailOtpType', () => {
    it('accepts known Supabase email OTP types', () => {
      expect(isEmailOtpType('signup')).toBe(true)
      expect(isEmailOtpType('email')).toBe(true)
      expect(isEmailOtpType('recovery')).toBe(true)
    })

    it('rejects unknown types', () => {
      expect(isEmailOtpType('oauth')).toBe(false)
    })
  })

  describe('getAuthCallbackQuery', () => {
    it('extracts token_hash and type from query params', () => {
      expect(
        getAuthCallbackQuery({
          token_hash: 'abc123',
          type: 'recovery',
        }),
      ).toEqual({
        tokenHash: 'abc123',
        type: 'recovery',
        code: undefined,
        errorCode: undefined,
        urlError: undefined,
      })
    })

    it('extracts PKCE code and URL errors', () => {
      expect(
        getAuthCallbackQuery({
          code: 'pkce-code',
          error_description: 'Link expired',
        }),
      ).toEqual({
        tokenHash: undefined,
        type: undefined,
        code: 'pkce-code',
        errorCode: undefined,
        urlError: 'Link expired',
      })
    })

    it('extracts error_code from query params', () => {
      expect(
        getAuthCallbackQuery({
          error_code: 'otp_expired',
        }),
      ).toEqual({
        tokenHash: undefined,
        type: undefined,
        code: undefined,
        errorCode: 'otp_expired',
        urlError: undefined,
      })
    })
  })

  describe('parseHashAuthParams', () => {
    it('reads recovery tokens from the URL hash', () => {
      expect(
        parseHashAuthParams(
          '#access_token=at&refresh_token=rt&type=recovery',
        ),
      ).toEqual({
        tokenHash: undefined,
        type: 'recovery',
        code: undefined,
        errorCode: undefined,
        urlError: undefined,
        accessToken: 'at',
        refreshToken: 'rt',
      })
    })
  })

  describe('mergeAuthCallbackParams', () => {
    it('prefers query params and fills gaps from the hash', () => {
      expect(
        mergeAuthCallbackParams(
          { type: 'recovery' },
          '#token_hash=hash-from-email',
        ),
      ).toEqual({
        tokenHash: 'hash-from-email',
        type: 'recovery',
        code: undefined,
        errorCode: undefined,
        urlError: undefined,
        accessToken: undefined,
        refreshToken: undefined,
      })
    })
  })
})
