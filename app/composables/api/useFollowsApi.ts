import type {
  AccountSummary,
  AccountType,
  UserConnection,
} from '~/types/profile'
import { useApiFetch } from './useApiFetch'

export function useFollowsApi() {
  const { apiFetch } = useApiFetch()

  async function follow(targetType: AccountType, targetId: string) {
    return apiFetch<{ success: boolean, following: boolean }>('/follows', {
      method: 'POST',
      body: { targetType, targetId },
    })
  }

  async function unfollow(targetType: AccountType, targetId: string) {
    return apiFetch<{ success: boolean, following: boolean }>('/follows', {
      method: 'DELETE',
      body: { targetType, targetId },
    })
  }

  async function listFollowing() {
    return apiFetch<AccountSummary[]>('/follows/me')
  }

  async function listConnections() {
    return apiFetch<UserConnection[]>('/follows/connections')
  }

  async function listFollowers(targetType: AccountType, targetId: string) {
    return apiFetch<AccountSummary[]>('/follows/followers', {
      query: { targetType, targetId },
    })
  }

  async function listFollowingForUser(userId: string) {
    return apiFetch<AccountSummary[]>('/follows/following', {
      query: { userId },
    })
  }

  async function status(targetType: AccountType, targetId: string) {
    return apiFetch<{ following: boolean }>('/follows/status', {
      query: { targetType, targetId },
    })
  }

  return {
    follow,
    unfollow,
    listFollowing,
    listConnections,
    listFollowers,
    listFollowingForUser,
    status,
  }
}
