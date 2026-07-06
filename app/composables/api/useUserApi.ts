import type { AuthMeResponse } from '~/types/user'
import { useApiConfig } from './useApiConfig'

export function useUserApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function fetchMe(forceRefresh = false) {
    const headers = await getAuthHeaders(forceRefresh)
    if (!headers.Authorization) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Missing access token',
      })
    }

    return $fetch<AuthMeResponse>(`${baseUrl}/auth/me`, {
      headers,
      credentials: 'include',
      timeout: 8_000,
    })
  }

  return { fetchMe }
}
