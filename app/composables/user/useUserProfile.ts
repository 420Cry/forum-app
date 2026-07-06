import type { AuthMeResponse } from '~/types/user'
import { isOnboardingComplete } from '~/types/user'
import { isFetchUnauthorized } from '~/utils/authSession'
import { useUserApi } from '../api/useUserApi'
import { useSupabaseToken } from '../auth/useSupabaseToken'

let profileRefreshInFlight: Promise<AuthMeResponse | null> | null = null

export function useUserProfile() {
  const profile = useState<AuthMeResponse | null>('forum-user-me', () => null)
  const loading = useState('forum-user-me-loading', () => false)
  const unauthorized = useState('forum-user-me-unauthorized', () => false)

  const isComplete = computed(() =>
    isOnboardingComplete(profile.value?.profile ?? null),
  )

  async function refreshProfile(force = false) {
    if (!force && profile.value) return profile.value

    if (profileRefreshInFlight && !force) {
      return profileRefreshInFlight
    }

    const run = async (): Promise<AuthMeResponse | null> => {
      const { getAccessToken } = useSupabaseToken()
      const token = await getAccessToken(force)
      if (!token) {
        profile.value = null
        unauthorized.value = true
        return null
      }

      loading.value = true
      try {
        const { fetchMe } = useUserApi()
        profile.value = await fetchMe(force)
        unauthorized.value = false
        return profile.value
      }
      catch (err) {
        profile.value = null
        unauthorized.value = isFetchUnauthorized(err)
        return null
      }
      finally {
        loading.value = false
      }
    }

    profileRefreshInFlight = run()
    try {
      return await profileRefreshInFlight
    }
    finally {
      profileRefreshInFlight = null
    }
  }

  function clearProfile() {
    profile.value = null
    unauthorized.value = false
    profileRefreshInFlight = null
  }

  return {
    profile,
    loading,
    unauthorized,
    isComplete,
    refreshProfile,
    clearProfile,
  }
}
