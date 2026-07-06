import { useApiConfig } from '../useApiConfig'
import type {
  OnboardDraftPayload,
  OnboardPayload,
  OnboardResponse,
  ProfileUpdatePayload,
} from '~/types/onboard/api'

export function useOnboardApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function saveOnboarding(payload: OnboardPayload) {
    const headers = await getAuthHeaders()
    return await $fetch<OnboardResponse>(`${baseUrl}/user/onboarding`, {
      method: 'POST',
      headers,
      body: payload,
    })
  }

  async function updateProfile(payload: ProfileUpdatePayload) {
    const headers = await getAuthHeaders()
    return await $fetch<OnboardResponse>(`${baseUrl}/user/profile`, {
      method: 'PATCH',
      headers,
      body: payload,
    })
  }

  async function saveOnboardingDraft(payload: OnboardDraftPayload) {
    const headers = await getAuthHeaders()
    return await $fetch<OnboardResponse>(`${baseUrl}/user/onboarding/draft`, {
      method: 'PATCH',
      headers,
      body: payload,
    })
  }

  return { saveOnboarding, saveOnboardingDraft, updateProfile }
}
