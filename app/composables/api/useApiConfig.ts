import { useSupabaseToken } from '../auth/useSupabaseToken'

export function useApiConfig() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.forumApiUrl
  const { getAccessToken } = useSupabaseToken()

  async function getAuthHeaders(
    forceRefresh = false,
  ): Promise<Record<string, string>> {
    const token = await getAccessToken(forceRefresh)
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
  }

  return { baseUrl, getAuthHeaders }
}
