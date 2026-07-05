import type { AuthMeResponse } from '~/types/user'
import { useApiConfig } from './useApiConfig'

export function useUserApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function fetchMe(forceRefresh = false) {
    const headers = await getAuthHeaders(forceRefresh)
    return $fetch<AuthMeResponse>(`${baseUrl}/auth/me`, {
      headers,
      credentials: 'include',
    })
  }

  return { fetchMe }
}
