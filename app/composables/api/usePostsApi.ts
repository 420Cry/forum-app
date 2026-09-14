import type { PostResponseDto } from '~/types/post'
import { useApiFetch } from './useApiFetch'

export function usePostsApi() {
  const { apiFetch } = useApiFetch()

  async function getFeed(limit?: number, cursor?: string) {
    return apiFetch<PostResponseDto>('/posts', {
      method: 'GET',
      query: { limit, cursor },
    })
  }

  return { getFeed }
}
