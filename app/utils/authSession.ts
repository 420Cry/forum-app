import type { Session } from '@supabase/supabase-js'

type EmailVerificationState = {
  email_confirmed_at?: string | null
}

export function isEmailVerified(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false
  return !!(user as EmailVerificationState).email_confirmed_at
}

export function hasAccessToken(session: Session | null | undefined): boolean {
  return !!session?.access_token
}

export function isFetchUnauthorized(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const status
    = (err as { status?: number }).status
      ?? (err as { statusCode?: number }).statusCode
  return status === 401
}
