import { isOnboardingComplete } from '~/types/user'
import {
  hasAccessToken,
  isEmailVerified,
  resolveAuthUser,
} from '~/utils/authSession'

export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const nuxtSession = useSupabaseSession()
  const { data: sessionData } = await supabase.auth.getSession()
  const supabaseUser = useSupabaseUser()

  const isAuthRoute = to.path.startsWith('/auth')
  const isConfirmRoute = to.path === '/auth/confirm'
  const isOnboardRoute = to.path === '/onboard'
  const isHomeRoute = to.path.startsWith('/home')
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

  if (!authUser || !isEmailVerified(authUser)) {
    await supabase.auth.refreshSession()
    const { data: userData } = await supabase.auth.getUser()
    authUser = resolveAuthUser(
      supabaseUser.value,
      session,
      userData.user,
    )
  }

  const emailVerified = isEmailVerified(authUser)

  if (!authUser) {
    if (isProtectedRoute) {
      return navigateTo('/auth/login')
    }
    return
  }

  if (!emailVerified) {
    if (isProtectedRoute) {
      return navigateTo('/auth')
    }
    if (isAuthRoute && !isConfirmRoute && to.path !== '/auth') {
      return navigateTo('/auth')
    }
    return
  }

  if (!import.meta.client) return

  const { profile, refreshProfile, unauthorized } = useUserProfile()

  // Protected routes: trust Supabase session on reload; don't block on forum-api profile fetch.
  if (isOnboardRoute || isHomeRoute) {
    void refreshProfile(false)

    const cached = profile.value?.profile ?? null
    if (isHomeRoute && cached && !isOnboardingComplete(cached)) {
      return navigateTo('/onboard')
    }
    if (isOnboardRoute && cached && isOnboardingComplete(cached)) {
      return navigateTo('/home')
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

  if (!completed && isAuthRoute && to.path !== '/auth/confirm') {
    return navigateTo('/onboard')
  }
})
