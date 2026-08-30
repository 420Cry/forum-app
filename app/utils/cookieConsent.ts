export const COOKIE_CONSENT_KEY = 'forum_cookie_consent'
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365
export const COOKIE_CONSENT_VERSION = 1

export type OptionalConsent = {
  performance: boolean
  functional: boolean
  targeting: boolean
}

export type CookieConsent = OptionalConsent & {
  v: number
  necessary: true
}

export const OPTIONAL_GROUPS = [
  'performance',
  'functional',
  'targeting',
] as const satisfies ReadonlyArray<keyof OptionalConsent>

/** Groups that actually have cookies or scripts. Empty until one ships. */
export const LIVE_OPTIONAL_GROUPS: Array<keyof OptionalConsent> = []

export const OPTIONAL_GROUP_COPY = OPTIONAL_GROUPS.map(key => ({
  key,
  heading: `common.heading.cookie_${key}`,
  info: `common.info.cookie_${key}`,
  aria: `common.aria.cookie_${key}`,
}))

export type CookieInventoryItem = {
  nameKey: string
  purposeKey: string
  durationKey: string
}

function inventoryItem(
  id: 'locale' | 'session' | 'consent',
): CookieInventoryItem {
  return {
    nameKey: `common.info.cookie_name_${id}`,
    purposeKey: `common.info.cookie_purpose_${id}`,
    durationKey: `common.info.cookie_duration_${id}`,
  }
}

export const COOKIE_INVENTORY: CookieInventoryItem[] = [
  inventoryItem('locale'),
  inventoryItem('session'),
  inventoryItem('consent'),
]

function withFlags(on: boolean): CookieConsent {
  return {
    v: COOKIE_CONSENT_VERSION,
    necessary: true,
    performance: on,
    functional: on,
    targeting: on,
  }
}

export function emptyConsent(): CookieConsent {
  return withFlags(false)
}

export function acceptAllConsent(): CookieConsent {
  return withFlags(true)
}

export function rejectAllConsent(): CookieConsent {
  return emptyConsent()
}

export function clampConsent(value: Partial<OptionalConsent>): CookieConsent {
  return {
    v: COOKIE_CONSENT_VERSION,
    necessary: true,
    performance: Boolean(value.performance),
    functional: Boolean(value.functional),
    targeting: Boolean(value.targeting),
  }
}

export function parseConsent(value: unknown): CookieConsent | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const record = value as Record<string, unknown>
  if (record.v !== COOKIE_CONSENT_VERSION) return null
  return clampConsent(record)
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
  return clampConsent({ ...(current ?? emptyConsent()), ...partial })
}

export function groupAllowed(
  consent: CookieConsent | null | undefined,
  key: keyof OptionalConsent,
) {
  return consent?.[key] === true
}

export function hasLiveOptionalCookies() {
  return LIVE_OPTIONAL_GROUPS.length > 0
}

function tryParseJson(raw: string): CookieConsent | null {
  try {
    return parseConsent(JSON.parse(raw))
  }
  catch {
    return null
  }
}

export function decodeConsentCookie(raw: string): CookieConsent | null {
  if (!raw) return null
  try {
    return parseConsent(JSON.parse(decodeURIComponent(raw)))
  }
  catch {
    return tryParseJson(raw)
  }
}

export function encodeConsentCookie(value: CookieConsent | null): string {
  if (!value) return ''
  return encodeURIComponent(JSON.stringify(clampConsent(value)))
}
