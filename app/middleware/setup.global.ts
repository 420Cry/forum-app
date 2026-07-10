import type { AuthMeResponse } from '~/types/user'
import type { RouteAccess } from '~/types/routes'
import { isProfileCacheStale } from '~/utils/profileCache'
import { stripLocalePrefix } from '~/utils/localePath'
import { onboardingRedirect, resolveVerifiedUser } from '~/utils/routeGuards'

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

  const localePath = useLocalePath()
  const barePath = stripLocalePrefix(path)

  const access: RouteAccess = to.meta.access ?? 'public'
  if (access === 'public' || access === 'callback') return

  const supabase = useSupabaseClient()
  const nuxtSession = useSupabaseSession()
  const { data: sessionData } = await supabase.auth.getSession()
  const session = sessionData.session ?? nuxtSession.value

  const auth = await resolveVerifiedUser(
    supabase,
    session,
    useSupabaseUser().value,
  )

  if (access === 'guest') {
    if (auth.status === 'verified') {
      return navigateTo(localePath('/social'), REDIRECT_REPLACE)
    }
    return
  }

  // access === 'protected'
  if (auth.status !== 'verified' || !auth.user) {
    return navigateTo(localePath('/auth/login'))
  }

  if (!import.meta.client) return

  const { profile, refreshProfile, unauthorized } = useUserProfile()
  const isHomeRoute = barePath.startsWith('/social')

  await syncProfile(refreshProfile, profile.value?.id, auth.user.id, {
    alwaysAwait: isHomeRoute,
  })

  if (unauthorized.value) {
    return navigateTo(localePath('/auth/login'))
  }

  const redirect = onboardingRedirect(path, profile.value?.profile ?? null)
  if (redirect) {
    return navigateTo(localePath(redirect), REDIRECT_REPLACE)
  }
})
