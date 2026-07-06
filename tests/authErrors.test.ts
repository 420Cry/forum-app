import { describe, expect, it } from 'vitest'
import {
  isValidAuthEmail,
  mapAuthErrorString,
  mapSupabaseAuthError,
  normalizeAuthEmail,
} from '~/utils/authErrors'

describe('normalizeAuthEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeAuthEmail('  Test@Gmail.COM  ')).toBe('test@gmail.com')
  })
})

describe('isValidAuthEmail', () => {
  it('accepts common addresses', () => {
    expect(isValidAuthEmail('test@gmail.com')).toBe(true)
    expect(isValidAuthEmail('alex.morgan@example.co.uk')).toBe(true)
  })

  it('rejects empty or malformed values', () => {
    expect(isValidAuthEmail('')).toBe(false)
    expect(isValidAuthEmail('not-an-email')).toBe(false)
    expect(isValidAuthEmail('missing-at.com')).toBe(false)
  })
})

describe('mapSupabaseAuthError', () => {
  const t = (key: string) => key

  it('maps by error code', () => {
    expect(
      mapSupabaseAuthError({ code: 'invalid_credentials' }, t),
    ).toBe('auth.error.invalid_credentials')
    expect(
      mapSupabaseAuthError({ code: 'email_not_confirmed' }, t),
    ).toBe('auth.error.email_not_verified')
  })

  it('maps rate limit errors', () => {
    expect(
      mapSupabaseAuthError(
        { code: 'over_email_send_rate_limit', message: 'Email rate limit exceeded' },
        t,
      ),
    ).toBe('auth.error.email_rate_limit')
  })

  it('maps invalid login credentials by message', () => {
    expect(
      mapSupabaseAuthError({ message: 'Invalid login credentials' }, t),
    ).toBe('auth.error.invalid_credentials')
  })

  it('maps invalid email errors', () => {
    expect(
      mapSupabaseAuthError(
        { message: 'Unable to validate email address: invalid format' },
        t,
      ),
    ).toBe('auth.error.email_invalid_format')
  })

  it('maps expired OTP / link errors by code', () => {
    expect(
      mapSupabaseAuthError({ code: 'otp_expired' }, t),
    ).toBe('auth.error.link_expired')
    expect(
      mapSupabaseAuthError({ code: 'flow_state_not_found' }, t),
    ).toBe('auth.error.link_expired')
  })

  it('maps expired link errors by message', () => {
    expect(
      mapSupabaseAuthError({ message: 'Email link is invalid or has expired' }, t),
    ).toBe('auth.error.link_expired')
  })

  it('falls back to unexpected for unknown errors', () => {
    expect(
      mapSupabaseAuthError({ message: 'Something else went wrong' }, t),
    ).toBe('auth.error.unexpected')
  })
})

describe('mapAuthErrorString', () => {
  const t = (key: string) => key

  it('maps plain strings', () => {
    expect(
      mapAuthErrorString('Invalid login credentials', t),
    ).toBe('auth.error.invalid_credentials')
  })

  it('returns try again when empty', () => {
    expect(mapAuthErrorString(null, t)).toBe('common.error.try_again')
  })

  it('maps callback errors by Supabase error code', () => {
    expect(
      mapAuthErrorString(null, t, 'otp_expired'),
    ).toBe('auth.error.link_expired')
  })
})
