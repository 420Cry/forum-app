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
      profile.value = await fetchMe(force)
      unauthorized.value = false
      // #region agent log
      fetch('http://127.0.0.1:7333/ingest/53b70a4d-6607-4f4d-b21f-38ed2957c68f', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '2c958a' }, body: JSON.stringify({ sessionId: '2c958a', runId: 'pre-fix', hypothesisId: 'B', location: 'useUserProfile.ts', message: 'refreshProfile ok', data: { onboardProcess: profile.value?.profile?.onboard_process ?? null }, timestamp: Date.now() }) }).catch(() => {})
      // #endregion
      return profile.value
    }
    catch (err) {
      profile.value = null
      unauthorized.value = isFetchUnauthorized(err)
      // #region agent log
      fetch('http://127.0.0.1:7333/ingest/53b70a4d-6607-4f4d-b21f-38ed2957c68f', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '2c958a' }, body: JSON.stringify({ sessionId: '2c958a', runId: 'pre-fix', hypothesisId: 'B', location: 'useUserProfile.ts', message: 'refreshProfile failed', data: { unauthorized: unauthorized.value, force }, timestamp: Date.now() }) }).catch(() => {})
      // #endregion
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
