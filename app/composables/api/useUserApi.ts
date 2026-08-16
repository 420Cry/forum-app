import type { AuthMeResponse } from '~/types/user'
import { useApiFetch } from './useApiFetch'

export function useUserApi() {
  const { apiFetch } = useApiFetch()

  async function fetchMe() {
    return apiFetch<AuthMeResponse>('/auth/me', {
      timeout: 8_000,
    })
  }

  return { fetchMe }
}
