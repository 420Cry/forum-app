const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeAuthEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidAuthEmail(email: string): boolean {
  return EMAIL_RE.test(email)
}

type SupabaseAuthError = {
  code?: string
  message?: string
} | null | undefined

/** Supabase AuthApiError `code` → i18n key under `auth.error.*`. */
const ERROR_CODE_KEYS: Record<string, string> = {
  invalid_credentials: 'auth.error.invalid_credentials',
  email_not_confirmed: 'auth.error.email_not_verified',
  user_already_exists: 'auth.error.user_already_exists',
  over_email_send_rate_limit: 'auth.error.email_rate_limit',
  email_address_invalid: 'auth.error.email_invalid_format',
  weak_password: 'auth.error.password_weak',
  same_password: 'auth.error.same_password',
  signup_disabled: 'auth.error.signup_disabled',
  user_not_found: 'auth.error.user_not_found',
  otp_expired: 'auth.error.link_expired',
  session_not_found: 'auth.error.session_invalid',
  refresh_token_not_found: 'auth.error.session_invalid',
  flow_state_not_found: 'auth.error.link_expired',
  bad_code_verifier: 'auth.error.link_expired',
  implicit_flow_disabled: 'auth.error.link_expired',
  validation_failed: 'auth.error.validation_failed',
  unexpected_failure: 'auth.error.unexpected',
}

type MessageRule = {
  test: (message: string) => boolean
  key: string
}

/** Fallback when `code` is missing — match known English GoTrue messages. */
const MESSAGE_RULES: MessageRule[] = [
  {
    test: m => m.includes('invalid login credentials'),
    key: 'auth.error.invalid_credentials',
  },
  {
    test: m => m.includes('email not confirmed'),
    key: 'auth.error.email_not_verified',
  },
  {
    test: m =>
      m.includes('already registered')
      || m.includes('already exists'),
    key: 'auth.error.user_already_exists',
  },
  {
    test: m => m.includes('email rate limit exceeded'),
    key: 'auth.error.email_rate_limit',
  },
  {
    test: m => m.includes('only request this once'),
    key: 'auth.error.email_cooldown',
  },
  {
    test: m =>
      m.includes('unable to validate email')
      || m.includes('invalid email'),
    key: 'auth.error.email_invalid_format',
  },
  {
    test: m =>
      m.includes('redirect') && m.includes('not allowed'),
    key: 'auth.error.redirect_not_allowed',
  },
  {
    test: m =>
      m.includes('password should be at least')
      || m.includes('signup requires a valid password'),
    key: 'auth.error.password_weak',
  },
  {
    test: m => m.includes('different from the old password'),
    key: 'auth.error.same_password',
  },
  {
    test: m =>
      m.includes('signups not allowed')
      || m.includes('signup is disabled'),
    key: 'auth.error.signup_disabled',
  },
  {
    test: m => m.includes('user not found'),
    key: 'auth.error.user_not_found',
  },
  {
    test: m =>
      m.includes('link is invalid')
      || m.includes('has expired')
      || m.includes('token has expired')
      || m.includes('otp expired'),
    key: 'auth.error.link_expired',
  },
]

/** Map raw Supabase auth errors to translated copy. Never returns raw API English. */
export function mapSupabaseAuthError(
  err: SupabaseAuthError,
  t: (key: string) => string,
): string {
  if (!err) return t('common.error.try_again')

  const code = err.code?.toLowerCase() ?? ''
  const codeKey = ERROR_CODE_KEYS[code]
  if (codeKey) return t(codeKey)

  const message = err.message?.toLowerCase() ?? ''
  for (const rule of MESSAGE_RULES) {
    if (rule.test(message)) return t(rule.key)
  }

  return t('auth.error.unexpected')
}

/** Translate a plain error string (e.g. from auth callback URL params). */
export function mapAuthErrorString(
  message: string | null | undefined,
  t: (key: string) => string,
  errorCode?: string | null,
): string {
  if (!message && !errorCode) return t('common.error.try_again')
  return mapSupabaseAuthError({ message, code: errorCode ?? undefined }, t)
}
