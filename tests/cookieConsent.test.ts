import { describe, expect, it } from 'vitest'
import {
  COOKIE_INVENTORY,
  LIVE_OPTIONAL_GROUPS,
  acceptAllConsent,
  decodeConsentCookie,
  emptyConsent,
  encodeConsentCookie,
  functionalAllowed,
  hasConsentDecision,
  hasLiveOptionalCookies,
  mergeConsent,
  parseConsent,
  performanceAllowed,
  rejectAllConsent,
  targetingAllowed,
} from '~/utils/cookieConsent'

describe('cookieConsent', () => {
  it('defaults optional groups off and necessary on', () => {
    expect(emptyConsent()).toEqual({
      v: 1,
      necessary: true,
      performance: false,
      functional: false,
      targeting: false,
    })
    expect(rejectAllConsent()).toEqual(emptyConsent())
  })

  it('accepts all optional groups even when none are live yet', () => {
    expect(LIVE_OPTIONAL_GROUPS).toEqual([])
    expect(hasLiveOptionalCookies()).toBe(false)
    expect(acceptAllConsent()).toEqual({
      v: 1,
      necessary: true,
      performance: true,
      functional: true,
      targeting: true,
    })
  })

  it('parses a valid stored decision and keeps optional flags', () => {
    expect(
      parseConsent({
        v: 1,
        necessary: false,
        performance: true,
        functional: 0,
        targeting: 'yes',
      }),
    ).toEqual({
      v: 1,
      necessary: true,
      performance: true,
      functional: false,
      targeting: true,
    })
  })

  it('rejects missing, wrong-version, or non-object values', () => {
    expect(parseConsent(null)).toBeNull()
    expect(parseConsent('1:1')).toBeNull()
    expect(parseConsent({ performance: true })).toBeNull()
    expect(parseConsent({ v: 2, performance: true })).toBeNull()
    expect(parseConsent([])).toBeNull()
  })

  it('treats a parsed payload as a decision', () => {
    expect(hasConsentDecision(null)).toBe(false)
    expect(hasConsentDecision(emptyConsent())).toBe(true)
    expect(hasConsentDecision(acceptAllConsent())).toBe(true)
  })

  it('saves optional group choices', () => {
    expect(mergeConsent(null, { performance: true })).toEqual({
      v: 1,
      necessary: true,
      performance: true,
      functional: false,
      targeting: false,
    })
    expect(
      mergeConsent(acceptAllConsent(), { targeting: false, functional: true }),
    ).toEqual({
      v: 1,
      necessary: true,
      performance: true,
      functional: true,
      targeting: false,
    })
  })

  it('reports optional groups from the stored decision', () => {
    expect(performanceAllowed(null)).toBe(false)
    expect(functionalAllowed(rejectAllConsent())).toBe(false)
    expect(targetingAllowed(acceptAllConsent())).toBe(true)
    expect(performanceAllowed(acceptAllConsent())).toBe(true)
  })

  it('lists the cookies the policy page should describe', () => {
    expect(COOKIE_INVENTORY.map(item => item.nameKey)).toEqual([
      'common.info.cookie_name_locale',
      'common.info.cookie_name_session',
      'common.info.cookie_name_consent',
    ])
  })

  it('round-trips through the cookie codec', () => {
    const encoded = encodeConsentCookie(acceptAllConsent())
    expect(encoded).toContain('%7B')
    expect(decodeConsentCookie(encoded)).toEqual(acceptAllConsent())
    expect(
      decodeConsentCookie(JSON.stringify(rejectAllConsent())),
    ).toEqual(rejectAllConsent())
    expect(decodeConsentCookie('')).toBeNull()
    expect(decodeConsentCookie('not-json')).toBeNull()
    expect(encodeConsentCookie(null)).toBe('')
  })
})
