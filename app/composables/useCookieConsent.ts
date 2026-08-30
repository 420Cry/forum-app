import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_MAX_AGE,
  acceptAllConsent,
  decodeConsentCookie,
  encodeConsentCookie,
  groupAllowed,
  hasConsentDecision,
  mergeConsent,
  parseConsent,
  rejectAllConsent,
  type CookieConsent,
  type OptionalConsent,
} from '~/utils/cookieConsent'

export function useCookieConsent() {
  const stored = useCookie<CookieConsent | null>(COOKIE_CONSENT_KEY, {
    default: () => null,
    maxAge: COOKIE_CONSENT_MAX_AGE,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    decode: decodeConsentCookie,
    encode: encodeConsentCookie,
  })

  const preferencesOpen = useState('cookie-preferences-open', () => false)

  /** useCookie reads the raw document.cookie string on first load (decode runs later). */
  const consent = computed(() => {
    const value = stored.value
    if (typeof value === 'string') return decodeConsentCookie(value)
    return parseConsent(value)
  })
  const hasDecision = computed(() => hasConsentDecision(consent.value))

  function persist(next: CookieConsent) {
    stored.value = next
    preferencesOpen.value = false
  }

  function allowed(key: keyof OptionalConsent) {
    return computed(() => groupAllowed(consent.value, key))
  }

  return {
    consent,
    hasDecision,
    preferencesOpen,
    acceptAll: () => persist(acceptAllConsent()),
    rejectAll: () => persist(rejectAllConsent()),
    save: (partial: Partial<OptionalConsent>) =>
      persist(mergeConsent(consent.value, partial)),
    openPreferences: () => {
      preferencesOpen.value = true
    },
    closePreferences: () => {
      preferencesOpen.value = false
    },
    performanceAllowed: allowed('performance'),
    functionalAllowed: allowed('functional'),
    targetingAllowed: allowed('targeting'),
  }
}
