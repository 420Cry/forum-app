export const COOKIE_CONSENT_KEY = 'forum_cookie_consent'
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365
export const COOKIE_CONSENT_VERSION = 1

export type CookieConsent = {
  v: number
  necessary: true
  performance: boolean
  functional: boolean
  targeting: boolean
}

export type OptionalConsent = Pick<
  CookieConsent,
  'performance' | 'functional' | 'targeting'
>

export const OPTIONAL_GROUPS: Array<keyof OptionalConsent> = [
  'performance',
  'functional',
  'targeting',
]

/** Optional groups that actually have cookies or scripts today. Keep empty until one ships. */
export const LIVE_OPTIONAL_GROUPS: Array<keyof OptionalConsent> = []

export type CookieInventoryItem = {
  nameKey: string
  purposeKey: string
  providerKey: string
  durationKey: string
}

export const COOKIE_INVENTORY: CookieInventoryItem[] = [
  {
    nameKey: 'common.info.cookie_name_locale',
    purposeKey: 'common.info.cookie_purpose_locale',
    providerKey: 'common.info.cookie_provider_fundedr',
    durationKey: 'common.info.cookie_duration_locale',
  },
  {
    nameKey: 'common.info.cookie_name_session',
    purposeKey: 'common.info.cookie_purpose_session',
    providerKey: 'common.info.cookie_provider_supabase',
    durationKey: 'common.info.cookie_duration_session',
  },
  {
    nameKey: 'common.info.cookie_name_consent',
    purposeKey: 'common.info.cookie_purpose_consent',
    providerKey: 'common.info.cookie_provider_fundedr',
    durationKey: 'common.info.cookie_duration_consent',
  },
]

export function emptyConsent(): CookieConsent {
  return {
    v: COOKIE_CONSENT_VERSION,
    necessary: true,
    performance: false,
    functional: false,
    targeting: false,
  }
}

export function clampConsent(value: CookieConsent): CookieConsent {
  return {
    v: COOKIE_CONSENT_VERSION,
    necessary: true,
    performance: Boolean(value.performance),
    functional: Boolean(value.functional),
    targeting: Boolean(value.targeting),
  }
}

export function acceptAllConsent(): CookieConsent {
  return {
    v: COOKIE_CONSENT_VERSION,
    necessary: true,
    performance: true,
    functional: true,
    targeting: true,
  }
}

export function rejectAllConsent(): CookieConsent {
  return emptyConsent()
}

export function parseConsent(value: unknown): CookieConsent | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  if (record.v !== COOKIE_CONSENT_VERSION) return null
  return clampConsent({
    v: COOKIE_CONSENT_VERSION,
    necessary: true,
    performance: Boolean(record.performance),
    functional: Boolean(record.functional),
    targeting: Boolean(record.targeting),
  })
}

export function hasConsentDecision(
  value: CookieConsent | null | undefined,
): value is CookieConsent {
  return value != null && value.v === COOKIE_CONSENT_VERSION
}

export function mergeConsent(
  current: CookieConsent | null | undefined,
  partial: Partial<OptionalConsent>,
): CookieConsent {
  const base = current ?? emptyConsent()
  return clampConsent({
    ...base,
    ...partial,
  })
}

export function performanceAllowed(consent: CookieConsent | null | undefined) {
  return consent?.performance === true
}

export function functionalAllowed(consent: CookieConsent | null | undefined) {
  return consent?.functional === true
}

export function targetingAllowed(consent: CookieConsent | null | undefined) {
  return consent?.targeting === true
}

export function hasLiveOptionalCookies() {
  return LIVE_OPTIONAL_GROUPS.length > 0
}

export function decodeConsentCookie(raw: string): CookieConsent | null {
  if (!raw) return null
  try {
    return parseConsent(JSON.parse(decodeURIComponent(raw)))
  }
  catch {
    try {
      return parseConsent(JSON.parse(raw))
    }
    catch {
      return null
    }
  }
}

export function encodeConsentCookie(value: CookieConsent | null): string {
  if (!value) return ''
  return encodeURIComponent(JSON.stringify(clampConsent(value)))
}
