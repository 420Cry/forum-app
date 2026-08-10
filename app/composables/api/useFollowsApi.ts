import type { AccountSummary, AccountType } from '~/types/profile'
import { useApiConfig } from './useApiConfig'

export function useFollowsApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function follow(targetType: AccountType, targetId: string) {
    const headers = await getAuthHeaders()
    return $fetch<{ success: boolean, following: boolean }>(
      `${baseUrl}/follows`,
      {
        method: 'POST',
        headers,
        body: { targetType, targetId },
      },
    )
  }

  async function unfollow(targetType: AccountType, targetId: string) {
    const headers = await getAuthHeaders()
    return $fetch<{ success: boolean, following: boolean }>(
      `${baseUrl}/follows`,
      {
        method: 'DELETE',
        headers,
        body: { targetType, targetId },
      },
    )
  }

  async function listFollowing() {
    const headers = await getAuthHeaders()
    return $fetch<AccountSummary[]>(`${baseUrl}/follows/me`, { headers })
  }

  async function status(targetType: AccountType, targetId: string) {
    const headers = await getAuthHeaders()
    return $fetch<{ following: boolean }>(`${baseUrl}/follows/status`, {
      headers,
      query: { targetType, targetId },
    })
  }

  return { follow, unfollow, listFollowing, status }
}
