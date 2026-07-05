import { isOnboardingComplete, postAuthPath } from '~/types/user'
import { hasAccessToken, isEmailVerified } from '~/utils/authSession'

const AUTH_GUEST_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
])

export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const user = useSupabaseUser()

  const isAuthRoute = to.path.startsWith('/auth')
  const isConfirmRoute = to.path === '/auth/confirm'
  const isOnboardRoute = to.path === '/onboard'
  const isHomeRoute = to.path.startsWith('/home')
  const isProtectedRoute = isOnboardRoute || isHomeRoute

  const hasSession = hasAccessToken(sessionData.session)
  const emailVerified = isEmailVerified(user.value)

  if (!user.value || !hasSession) {
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

  await supabase.auth.refreshSession()

  const { profile, refreshProfile, unauthorized } = useUserProfile()
  await refreshProfile(true)

  if (unauthorized.value && isProtectedRoute) {
    return navigateTo('/auth')
  }

  const userProfile = profile.value?.profile ?? null
  const completed = isOnboardingComplete(userProfile)

  if (completed && isOnboardRoute) {
    return navigateTo('/home')
  }

  if (!completed && isHomeRoute) {
    return navigateTo('/onboard')
  }

  if (completed && isAuthRoute && AUTH_GUEST_PATHS.has(to.path)) {
    return navigateTo('/home')
  }

  if (!completed && to.path === '/auth') {
    return navigateTo(postAuthPath(userProfile))
  }
})
