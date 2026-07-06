import type { User } from '@supabase/supabase-js'

type EmailVerificationState = {
  email_confirmed_at?: string | null
}

/** Structural session shape — useSupabaseSession() returns Omit<Session, 'user'>. */
export type SessionLike = {
  access_token?: string
  user?: User | null
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
