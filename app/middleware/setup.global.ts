import { isOnboardingComplete } from '~/types/user'
import { hasAccessToken, resolveAuthUser } from '~/utils/authSession'
import { isProfileCacheStale } from '~/utils/profileCache'
import type { AuthMeResponse } from '~/types/user'

const REDIRECT_REPLACE = { replace: true } as const

type RefreshProfile = (force?: boolean) => Promise<AuthMeResponse | null>

async function syncProfile(
  refreshProfile: RefreshProfile,
  cachedId: string | null | undefined,
  authUserId: string,
  options: { alwaysAwait: boolean },
) {
  const stale = isProfileCacheStale(cachedId, authUserId)
  const task = stale ? refreshProfile(true) : refreshProfile(false)

  if (options.alwaysAwait || stale) await task
  else void task
}

export default defineNuxtRouteMiddleware(async (to) => {
  const path = typeof to.path === 'string' ? to.path : ''
  if (!path) return

  const supabase = useSupabaseClient()
  const nuxtSession = useSupabaseSession()
  const { data: sessionData } = await supabase.auth.getSession()
  const supabaseUser = useSupabaseUser()

  const isAuthRoute = path.startsWith('/auth')
  const isOnboardRoute = path === '/onboard'
  const isHomeRoute = path.startsWith('/home')
  const isProtectedRoute = isOnboardRoute || isHomeRoute

  const session = sessionData.session ?? nuxtSession.value
  const hasSession = hasAccessToken(session)

  if (!hasSession) {
    if (isProtectedRoute) {
      return navigateTo('/auth/login')
    }
    return
  }

  let authUser = resolveAuthUser(supabaseUser.value, session, null)

  if (!authUser) {
    await supabase.auth.refreshSession()
    const { data: userData } = await supabase.auth.getUser()
    authUser = resolveAuthUser(
      supabaseUser.value,
      session,
      userData.user,
    )
  }

  if (!authUser) {
    if (isProtectedRoute) {
      return navigateTo('/auth/login')
    }
    return
  }

  if (!import.meta.client) return

  const { profile, refreshProfile, unauthorized } = useUserProfile()
  const authUserId = authUser.id

  if (isHomeRoute) {
    await syncProfile(
      refreshProfile,
      profile.value?.id,
      authUserId,
      { alwaysAwait: true },
    )

    if (!isOnboardingComplete(profile.value?.profile ?? null)) {
      return navigateTo('/onboard', REDIRECT_REPLACE)
    }
    return
  }

  if (isOnboardRoute) {
    await syncProfile(
      refreshProfile,
      profile.value?.id,
      authUserId,
      { alwaysAwait: false },
    )

    const cached = profile.value?.profile ?? null
    if (cached && isOnboardingComplete(cached)) {
      return navigateTo('/home', REDIRECT_REPLACE)
    }
    return
  }

  if (!profile.value) {
    await refreshProfile(false)
  }

  if (unauthorized.value && isProtectedRoute) {
    return navigateTo('/auth/login')
  }

  const userProfile = profile.value?.profile ?? null
  const completed = isOnboardingComplete(userProfile)

  if (completed && isAuthRoute) {
    return navigateTo('/home')
  }

  if (!completed && isAuthRoute && path !== '/auth/confirm') {
    return navigateTo('/onboard')
  }
})
