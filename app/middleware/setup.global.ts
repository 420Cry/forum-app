import { isOnboardingComplete } from '~/types/user'
import {
  hasAccessToken,
  isEmailVerified,
  resolveAuthUser,
} from '~/utils/authSession'

const AUTH_GUEST_PATHS = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
])

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

  // #region agent log
  const debugLog = (branch: string, extra: Record<string, unknown> = {}) => {
    fetch('http://127.0.0.1:7333/ingest/53b70a4d-6607-4f4d-b21f-38ed2957c68f', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '2c958a' }, body: JSON.stringify({ sessionId: '2c958a', runId: 'post-fix', hypothesisId: 'A,B,C', location: 'setup.global.ts', message: 'middleware branch', data: { branch, to: to.path, hasSession, hasUser: !!supabaseUser.value, isProtectedRoute, isAuthRoute, ...extra }, timestamp: Date.now() }) }).catch(() => {})
  }
  debugLog('entry')
  // #endregion

  if (!hasSession) {
    if (isProtectedRoute) {
      // #region agent log
      debugLog('redirect-login-no-session')
      // #endregion
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

  // #region agent log
  debugLog('session-resolved', { hasAuthUser: !!authUser, emailVerified })
  // #endregion

  if (!authUser) {
    if (isProtectedRoute) {
      // #region agent log
      debugLog('redirect-login-no-auth-user')
      // #endregion
      return navigateTo('/auth/login')
    }
    return
  }

  if (!emailVerified) {
    if (isProtectedRoute) {
      // #region agent log
      debugLog('redirect-auth-unverified-protected')
      // #endregion
      return navigateTo('/auth')
    }
    if (isAuthRoute && !isConfirmRoute && to.path !== '/auth') {
      // #region agent log
      debugLog('redirect-auth-unverified-auth-route')
      // #endregion
      return navigateTo('/auth')
    }
    return
  }

  const { profile, refreshProfile, unauthorized } = useUserProfile()
  await refreshProfile(true)

  if (unauthorized.value && isProtectedRoute) {
    // #region agent log
    debugLog('redirect-login-unauthorized', { onboardProcess: profile.value?.profile?.onboard_process ?? null })
    // #endregion
    return navigateTo('/auth/login')
  }

  const userProfile = profile.value?.profile ?? null
  const completed = isOnboardingComplete(userProfile)

  if (completed && isOnboardRoute) {
    // #region agent log
    debugLog('redirect-home-from-onboard')
    // #endregion
    return navigateTo('/home')
  }

  if (!completed && isHomeRoute) {
    // #region agent log
    debugLog('redirect-onboard-from-home')
    // #endregion
    return navigateTo('/onboard')
  }

  if (completed && isAuthRoute) {
    // #region agent log
    debugLog('redirect-home-from-auth')
    // #endregion
    return navigateTo('/home')
  }

  if (!completed && isAuthRoute && to.path !== '/auth/confirm') {
    // #region agent log
    debugLog('redirect-onboard-from-auth')
    // #endregion
    return navigateTo('/onboard')
  }

  // #region agent log
  debugLog('pass-through', { onboardProcess: userProfile?.onboard_process ?? null, completed })
  // #endregion
})
