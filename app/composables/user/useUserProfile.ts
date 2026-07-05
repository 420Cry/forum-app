import type { AuthMeResponse } from '~/types/user'
import { isOnboardingComplete } from '~/types/user'
import { isFetchUnauthorized } from '~/utils/authSession'
import { useUserApi } from '../api/useUserApi'

export function useUserProfile() {
  const profile = useState<AuthMeResponse | null>('forum-user-me', () => null)
  const loading = useState('forum-user-me-loading', () => false)
  const unauthorized = useState('forum-user-me-unauthorized', () => false)

  const isComplete = computed(() =>
    isOnboardingComplete(profile.value?.profile ?? null),
  )

  async function refreshProfile(force = false) {
    if (!force && profile.value) return profile.value

    loading.value = true
    try {
      const { fetchMe } = useUserApi()
      profile.value = await fetchMe()
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

  function clearProfile() {
    profile.value = null
    unauthorized.value = false
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
