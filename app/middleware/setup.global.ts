import { isOnboardingComplete } from '~/types/user'
import {
  hasAccessToken,
  isEmailVerified,
  resolveAuthUser,
} from '~/utils/authSession'

export default defineNuxtRouteMiddleware(async (to) => {
  const supabase = useSupabaseClient()
  const { data: sessionData } = await supabase.auth.getSession()
  const supabaseUser = useSupabaseUser()

  const isAuthRoute = to.path.startsWith('/auth')
  const isConfirmRoute = to.path === '/auth/confirm'
  const isOnboardRoute = to.path === '/onboard'
  const isHomeRoute = to.path.startsWith('/home')
  const isProtectedRoute = isOnboardRoute || isHomeRoute

  const session = sessionData.session
  const hasSession = hasAccessToken(session)

  if (!hasSession) {
    if (isProtectedRoute) {
      return navigateTo('/auth/login')
    }
    return
  }

  await supabase.auth.refreshSession()
  const { data: userData } = await supabase.auth.getUser()
  const authUser = resolveAuthUser(
    supabaseUser.value,
    session,
    userData.user,
  )
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

  const { profile, refreshProfile, unauthorized } = useUserProfile()
  await refreshProfile(true)

  if (unauthorized.value && isProtectedRoute) {
    return navigateTo('/auth/login')
  }

  const userProfile = profile.value?.profile ?? null
  const completed = isOnboardingComplete(userProfile)

  if (completed && isOnboardRoute) {
    return navigateTo('/home')
  }

  if (!completed && isHomeRoute) {
    return navigateTo('/onboard')
  }

  if (completed && isAuthRoute) {
    return navigateTo('/home')
  }

  if (!completed && isAuthRoute && to.path !== '/auth/confirm') {
    return navigateTo('/onboard')
  }
})
