import type { AuthMeResponse } from '~/types/user'
import type { RouteAccess } from '~/types/routes'
import { isProfileCacheStale } from '~/utils/profileCache'
import { onboardingRedirect, resolveVerifiedUser } from '~/utils/routeGuards'
import {
  AUTH_REDIRECT_QUERY,
  resolvePostAuthPath,
  sanitizeAuthRedirect,
} from '~/utils/authRedirect'

const REDIRECT_REPLACE = { replace: true } as const

type RefreshProfile = (force?: boolean) => Promise<AuthMeResponse | null>

async function syncProfile(
  refreshProfile: RefreshProfile,
  cachedId: string | null | undefined,
  authUserId: string,
  options: { alwaysAwait: boolean },
) {
  const missing = cachedId == null
  const stale = isProfileCacheStale(cachedId, authUserId)
  const task = stale || missing ? refreshProfile(true) : refreshProfile(false)

  if (options.alwaysAwait || stale || missing) await task
  else void task
}

export default defineNuxtRouteMiddleware(async (to) => {
  const path = typeof to.path === 'string' ? to.path : ''
  if (!path) return

  const localePath = useLocalePath()

  const access: RouteAccess = to.meta.access ?? 'public'
  if (access === 'public' || access === 'callback') return

  const supabase = useSupabaseClient()
  const nuxtSession = useSupabaseSession()
  const { data: sessionData } = await supabase.auth.getSession()
  const session = import.meta.server
    ? (sessionData.session ?? nuxtSession.value)
    : sessionData.session

  const auth = await resolveVerifiedUser(
    supabase,
    session,
    useSupabaseUser().value,
  )

  if (access === 'guest') {
    if (auth.status === 'verified' && auth.user) {
      const safe = sanitizeAuthRedirect(to.query[AUTH_REDIRECT_QUERY])
      const { profile, refreshProfile, unauthorized } = useUserProfile()

      // Prefer cached profile so we don't bounce incomplete users via /social.
      if (profile.value != null) {
        const target = resolvePostAuthPath(profile.value.profile, safe)
        return navigateTo(localePath(target), REDIRECT_REPLACE)
      }

      await syncProfile(refreshProfile, profile.value?.id, auth.user.id, {
        alwaysAwait: true,
      })
      if (unauthorized.value) {
        return navigateTo(localePath('/auth/login'), REDIRECT_REPLACE)
      }
      const target = resolvePostAuthPath(
        profile.value?.profile ?? null,
        safe,
      )
      return navigateTo(localePath(target), REDIRECT_REPLACE)
    }
    return
  }

  // access === 'protected'
  if (auth.status !== 'verified' || !auth.user) {
    return navigateTo(localePath('/auth/login'))
  }

  const { profile, refreshProfile, unauthorized } = useUserProfile()
  if (unauthorized.value) {
    return navigateTo(localePath('/auth/login'))
  }

  // Fast path: known incomplete profile → redirect before any /auth/me wait (no flash).
  if (profile.value != null) {
    const early = onboardingRedirect(path, profile.value.profile)
    if (early) {
      return navigateTo(localePath(early), REDIRECT_REPLACE)
    }
  }

  // SSR + client: resolve profile before allowing protected pages.
  await syncProfile(refreshProfile, profile.value?.id, auth.user.id, {
    alwaysAwait: true,
  })

  if (unauthorized.value) {
    return navigateTo(localePath('/auth/login'))
  }

  const redirect = onboardingRedirect(path, profile.value?.profile ?? null)
  if (redirect) {
    return navigateTo(localePath(redirect), REDIRECT_REPLACE)
  }
})
