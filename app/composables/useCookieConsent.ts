import {
  COOKIE_CONSENT_KEY,
  COOKIE_CONSENT_MAX_AGE,
  acceptAllConsent,
  decodeConsentCookie,
  encodeConsentCookie,
  functionalAllowed,
  hasConsentDecision,
  mergeConsent,
  parseConsent,
  performanceAllowed,
  rejectAllConsent,
  targetingAllowed,
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

  const consent = computed(() => parseConsent(stored.value))
  const hasDecision = computed(() => hasConsentDecision(consent.value))

  function persist(next: CookieConsent) {
    stored.value = next
    preferencesOpen.value = false
  }

  function acceptAll() {
    persist(acceptAllConsent())
  }

  function rejectAll() {
    persist(rejectAllConsent())
  }

  function save(partial: Partial<OptionalConsent>) {
    persist(mergeConsent(consent.value, partial))
  }

  function openPreferences() {
    preferencesOpen.value = true
  }

  function closePreferences() {
    preferencesOpen.value = false
  }

  return {
    consent,
    hasDecision,
    preferencesOpen,
    acceptAll,
    rejectAll,
    save,
    openPreferences,
    closePreferences,
    performanceAllowed: computed(() => performanceAllowed(consent.value)),
    functionalAllowed: computed(() => functionalAllowed(consent.value)),
    targetingAllowed: computed(() => targetingAllowed(consent.value)),
  }
}
