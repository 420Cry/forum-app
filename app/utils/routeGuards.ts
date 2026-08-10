import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '~/types/user'
import { isOnboardingComplete } from '~/types/user'
import { stripLocalePrefix } from '~/utils/localePath'
import type { SessionLike } from '~/utils/authSession'
import {
  hasAccessToken,
  isEmailVerified,
  resolveAuthUser,
} from '~/utils/authSession'

/** Minimal auth surface — keeps the guard decoupled from client generics. */
export type AuthClient = {
  auth: {
    refreshSession: () => Promise<unknown>
    getUser: () => Promise<{ data: { user: User | null } }>
  }
}

export type AuthStatus = 'none' | 'unverified' | 'verified'

export type ResolvedAuth = {
  status: AuthStatus
  user: User | null
}

/**
 * Resolves the current auth user from the session and classifies it:
 * no session, session with unverified email, or verified.
 * Falls back to a refresh + getUser when the user isn't available locally.
 */
export async function resolveVerifiedUser(
  supabase: AuthClient,
  session: SessionLike | null | undefined,
  supabaseUser: unknown,
): Promise<ResolvedAuth> {
  if (!hasAccessToken(session)) {
    return { status: 'none', user: null }
  }

  let user = resolveAuthUser(supabaseUser, session, null)

  if (!user) {
    await supabase.auth.refreshSession()
    const { data } = await supabase.auth.getUser()
    user = resolveAuthUser(supabaseUser, session, data.user)
  }

  if (!user) {
    return { status: 'none', user: null }
  }

  return {
    status: isEmailVerified(user) ? 'verified' : 'unverified',
    user,
  }
}

/**
 * Where a verified user on a protected route should be redirected based on
 * onboarding state, or null to stay.
 *
 * Incomplete users may only stay on `/onboard`. Completed users are bounced
 * off `/onboard` to `/social`.
 */
export function onboardingRedirect(
  path: string,
  profile: UserProfile | null | undefined,
): string | null {
  const barePath = stripLocalePrefix(path)
  const completed = isOnboardingComplete(profile)
  const onOnboard
    = barePath === '/onboard' || barePath.startsWith('/onboard/')

  if (!completed) {
    return onOnboard ? null : '/onboard'
  }

  if (onOnboard) return '/social'
  return null
}
