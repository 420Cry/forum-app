import { useApiFetch } from '../useApiFetch'
import type {
  OnboardDraftPayload,
  OnboardPayload,
  OnboardResponse,
  ProfileUpdatePayload,
} from '~/types/onboard/api'

export function useOnboardApi() {
  const { apiFetch } = useApiFetch()

  async function saveOnboarding(payload: OnboardPayload) {
    return apiFetch<OnboardResponse>('/user/onboarding', {
      method: 'POST',
      body: payload,
    })
  }

  async function updateProfile(payload: ProfileUpdatePayload) {
    return apiFetch<OnboardResponse>('/user/profile', {
      method: 'PATCH',
      body: payload,
    })
  }

  async function saveOnboardingDraft(payload: OnboardDraftPayload) {
    return apiFetch<OnboardResponse>('/user/onboarding/draft', {
      method: 'PATCH',
      body: payload,
    })
  }

  return { saveOnboarding, saveOnboardingDraft, updateProfile }
}
