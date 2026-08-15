import type { User } from '@supabase/supabase-js'

type EmailVerificationState = {
  email_confirmed_at?: string | null
}

/** Structural session shape — useSupabaseSession() returns Omit<Session, 'user'>. */
export type SessionLike = {
  access_token?: string
  expires_at?: number
  user?: User | null
}

/** Refresh this long before expiry so in-flight requests keep a valid JWT. */
export const TOKEN_REFRESH_MARGIN_MS = 60_000

/**
 * True when the access token is within the refresh margin of expiring.
 * `expiresAt` is the Supabase `expires_at` claim (unix seconds); an absent
 * value means unknown, which never triggers a refresh on its own.
 */
export function isTokenExpiring(
  expiresAt: number | null | undefined,
  nowMs: number = Date.now(),
  marginMs: number = TOKEN_REFRESH_MARGIN_MS,
): boolean {
  if (!expiresAt) return false
  return expiresAt * 1000 - nowMs <= marginMs
}

export function isEmailVerified(user: unknown): boolean {
  if (!user || typeof user !== 'object') return false
  return !!(user as EmailVerificationState).email_confirmed_at
}

export function hasAccessToken(session: SessionLike | null | undefined): boolean {
  return !!session?.access_token
}

export function resolveAuthUser(
  supabaseUser: unknown,
  session: SessionLike | null | undefined,
  fetchedUser?: User | null | undefined,
): User | null {
  if (fetchedUser) return fetchedUser
  if (supabaseUser && typeof supabaseUser === 'object' && 'id' in supabaseUser) {
    return supabaseUser as User
  }
  return session?.user ?? null
}

export function isFetchUnauthorized(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false
  const status
    = (err as { status?: number }).status
      ?? (err as { statusCode?: number }).statusCode
  return status === 401
}

export function isSignupUserAlreadyExistsError(
  err: { code?: string, message?: string } | null | undefined,
): boolean {
  if (!err) return false
  if (err.code === 'user_already_exists') return true

  const message = err.message?.toLowerCase() ?? ''
  return message.includes('already registered') || message.includes('already exists')
}

/** Supabase returns an obfuscated user with no identities when email already exists. */
export function isDuplicateSignupUser(user: User | null | undefined): boolean {
  return Array.isArray(user?.identities) && user.identities.length === 0
}
