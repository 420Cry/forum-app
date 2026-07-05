import type { RolePayload } from '~/types/onboard/schema/rolePayloadSchema'
import { useApiConfig } from '../useApiConfig'
import type { OnboardResponse } from '~/types/onboard/api'
import type { OnboardInfo } from '~/types/onboard/schema/onboardInfoSchema'

export function useOnboardApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function saveUserRole(role: RolePayload) {
    const headers = await getAuthHeaders()
    return await $fetch<OnboardResponse>(`${baseUrl}/user/role`, {
      method: 'POST',
      headers,
      body: role,
    })
  }

  async function saveUserGoals(goals: string[]) {
    const headers = await getAuthHeaders()
    return await $fetch<OnboardResponse>(`${baseUrl}/user/goals`, {
      method: 'POST',
      headers,
      body: { goals },
    })
  }

  async function saveUserInfo(onboardInfo: OnboardInfo) {
    const headers = await getAuthHeaders()
    return await $fetch<OnboardResponse>(`${baseUrl}/user/info`, {
      method: 'POST',
      headers,
      body: onboardInfo,
    })
  }

  return { saveUserRole, saveUserGoals, saveUserInfo }
}
