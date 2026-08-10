import { describe, expect, it } from 'vitest'
import {
  authReturnPathFromRoute,
  resolvePostAuthPath,
  sanitizeAuthRedirect,
} from '~/utils/authRedirect'
import type { UserProfile } from '~/types/user'

const complete: UserProfile = {
  onboarded: true,
  onboardingStep: null,
  role: 'Investor',
  name: 'Alex',
  occupation: null,
  age: null,
  dateOfBirth: null,
  location: null,
  avatarUrl: null,
  urlKey: 'alex',
  profilePath: '/u/alex',
  goals: [],
}

const incomplete: UserProfile = {
  ...complete,
  onboarded: false,
  role: 'Founder',
}

describe('sanitizeAuthRedirect', () => {
  it('accepts locale-stripped public profile paths', () => {
    expect(sanitizeAuthRedirect('/u/alex')).toBe('/u/alex')
    expect(sanitizeAuthRedirect('/en/u/alex')).toBe('/u/alex')
    expect(sanitizeAuthRedirect('/vn/startup/acme')).toBe('/startup/acme')
  })

  it('rejects open redirects and auth loops', () => {
    expect(sanitizeAuthRedirect('https://evil.test')).toBeNull()
    expect(sanitizeAuthRedirect('//evil.test')).toBeNull()
    expect(sanitizeAuthRedirect('/auth/login')).toBeNull()
    expect(sanitizeAuthRedirect('/en/auth/register')).toBeNull()
    expect(sanitizeAuthRedirect('../etc/passwd')).toBeNull()
  })
})

describe('resolvePostAuthPath', () => {
  it('keeps incomplete users on onboarding', () => {
    expect(resolvePostAuthPath(incomplete, '/u/alex')).toBe('/onboard')
    expect(resolvePostAuthPath(null, '/u/alex')).toBe('/onboard')
  })

  it('returns safe redirect for onboarded users', () => {
    expect(resolvePostAuthPath(complete, '/en/u/alex')).toBe('/u/alex')
    expect(resolvePostAuthPath(complete, null)).toBe('/social')
  })
})

describe('authReturnPathFromRoute', () => {
  it('strips locale and query from the current route', () => {
    expect(authReturnPathFromRoute('/en/u/alex?x=1')).toBe('/u/alex')
    expect(authReturnPathFromRoute('/auth/login')).toBeNull()
  })
})
