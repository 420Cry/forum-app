import type { AuthMeResponse } from '~/types/user'
import { isOnboardingComplete } from '~/types/user'
import { isFetchUnauthorized } from '~/utils/authSession'
import { useUserApi } from '../api/useUserApi'

let profileRefreshInFlight: Promise<AuthMeResponse | null> | null = null
/** Bumped on clear so in-flight fetches cannot write stale results back. */
let profileEpoch = 0

export function useUserProfile() {
  const profile = useState<AuthMeResponse | null>('forum-user-me', () => null)
  const loading = useState('forum-user-me-loading', () => false)
  const profileLoaded = useState('forum-user-me-loaded', () => false)
  const unauthorized = useState('forum-user-me-unauthorized', () => false)

  const isComplete = computed(() =>
    isOnboardingComplete(profile.value?.profile ?? null),
  )

  const profileDetailsPending = computed(
    () => loading.value || !profileLoaded.value,
  )

  async function refreshProfile(force = false) {
    if (!force && profile.value) {
      profileLoaded.value = true
      return profile.value
    }

    // Coalesce concurrent refreshes — even forced ones. Callers that cleared
    // the cache already bumped the epoch; stacking refreshSession storms hung
    // /auth/me in the browser and left onboarded users on /onboard.
    if (profileRefreshInFlight) {
      return profileRefreshInFlight
    }

    const epoch = profileEpoch
    const run = async (): Promise<AuthMeResponse | null> => {
      loading.value = true
      try {
        const { fetchMe } = useUserApi()
        const me = await fetchMe()
        if (epoch !== profileEpoch) return profile.value
        profile.value = me
        unauthorized.value = false
        return profile.value
      }
      catch (err) {
        if (epoch !== profileEpoch) return profile.value
        profile.value = null
        unauthorized.value = isFetchUnauthorized(err)
        return null
      }
      finally {
        if (epoch === profileEpoch) {
          loading.value = false
          profileLoaded.value = true
        }
      }
    }

    const pending = run()
    profileRefreshInFlight = pending
    try {
      return await pending
    }
    finally {
      if (profileRefreshInFlight === pending) {
        profileRefreshInFlight = null
      }
    }
  }

  function clearProfile() {
    profileEpoch += 1
    profile.value = null
    unauthorized.value = false
    profileRefreshInFlight = null
    loading.value = false
    profileLoaded.value = false
  }

  return {
    profile,
    loading,
    profileLoaded,
    profileDetailsPending,
    unauthorized,
    isComplete,
    refreshProfile,
    clearProfile,
  }
}
