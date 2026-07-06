import type { Session, User } from '@supabase/supabase-js'

export function hasAccessToken(session: Session | null | undefined): boolean {
  return !!session?.access_token
}

export function resolveAuthUser(
  supabaseUser: unknown,
  session: Session | null | undefined,
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
