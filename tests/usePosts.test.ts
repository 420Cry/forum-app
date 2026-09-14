import { computed, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AccountSummary } from '~/types/profile'
import type { PostDto, PostResponseDto } from '~/types/post'
import type { ReactionType } from '~/types/reaction'

const getFeed = vi.fn<(limit?: number, cursor?: string) => Promise<PostResponseDto>>()
const showApiError = vi.fn()

vi.mock('~/composables/api/usePostsApi', () => ({
  usePostsApi: () => ({ getFeed }),
}))

vi.mock('~/composables/api/useApiError', () => ({
  useApiError: () => ({ showApiError }),
}))

// `usePosts.ts` leans on Nuxt auto-imports (Vue reactivity + app/utils helpers)
// that a plain Node-environment vitest run doesn't provide.
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('toAccountSummaryView', (author: AccountSummary) => ({
  ...author,
  prefix: '',
  avatarColor: '',
  avatarLoadFailed: false,
  subtitle: author.headline ?? '',
  avatar: '',
}))
vi.stubGlobal('formatRelativeTime', () => 'stubbed-time')

const { usePosts } = await import('~/composables/posts/usePosts')

const zeroCounts: Record<ReactionType, number> = {
  back: 0,
  watch: 0,
  signal: 0,
  celebrate: 0,
  insight: 0,
}

const author: AccountSummary = {
  id: 'author-1',
  name: 'Ada Lovelace',
  headline: 'Engineer',
  location: null,
  avatarUrl: null,
  href: '/u/ada',
  accountType: 'user',
}

function makePostDto(id: string): PostDto {
  return {
    id,
    content: `content-${id}`,
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: null,
    visibility: 'public',
    reactionInfo: { total: 0, counts: { ...zeroCounts }, viewerReaction: null },
    author,
  }
}

function makeResponse(ids: string[], nextCursor: string | null, hasMore: boolean): PostResponseDto {
  return { items: ids.map(makePostDto), nextCursor, hasMore }
}

describe('usePosts', () => {
  beforeEach(() => {
    getFeed.mockReset()
    showApiError.mockReset()
  })

  it('loadPosts replaces posts and stores the next cursor', async () => {
    getFeed.mockResolvedValueOnce(makeResponse(['p1', 'p2'], 'cursor-2', true))
    const { posts, cursor, hasMore, isLoading, loadPosts } = usePosts()

    const promise = loadPosts()
    expect(isLoading.value).toBe(true)
    await promise

    expect(posts.value.map(p => p.id)).toEqual(['p1', 'p2'])
    expect(cursor.value).toBe('cursor-2')
    expect(hasMore.value).toBe(true)
    expect(isLoading.value).toBe(false)
  })

  it('loadMore appends to existing posts and advances the cursor', async () => {
    getFeed.mockResolvedValueOnce(makeResponse(['p1'], 'cursor-2', true))
    const { posts, cursor, loadPosts, loadMore } = usePosts()
    await loadPosts()

    getFeed.mockResolvedValueOnce(makeResponse(['p2'], 'cursor-3', true))
    await loadMore()

    expect(posts.value.map(p => p.id)).toEqual(['p1', 'p2'])
    expect(cursor.value).toBe('cursor-3')
    expect(getFeed).toHaveBeenLastCalledWith(5, 'cursor-2')
  })

  it('loadMore clears the cursor and hasMore once the last page loads', async () => {
    getFeed.mockResolvedValueOnce(makeResponse(['p1'], 'cursor-2', true))
    const { cursor, hasMore, loadPosts, loadMore } = usePosts()
    await loadPosts()

    getFeed.mockResolvedValueOnce(makeResponse(['p2'], null, false))
    await loadMore()

    expect(cursor.value).toBeNull()
    expect(hasMore.value).toBe(false)
  })

  it('loadMore is a no-op once there is no cursor', async () => {
    getFeed.mockResolvedValueOnce(makeResponse(['p1'], null, false))
    const { loadPosts, loadMore } = usePosts()
    await loadPosts()

    getFeed.mockClear()
    await loadMore()

    expect(getFeed).not.toHaveBeenCalled()
  })

  it('loadMore is a no-op while a load is already in flight', async () => {
    getFeed.mockResolvedValueOnce(makeResponse(['p1'], 'cursor-2', true))
    const { loadPosts, loadMore } = usePosts()
    await loadPosts()

    let resolveSecondPage: (value: PostResponseDto) => void = () => {}
    getFeed.mockImplementationOnce(() => new Promise((resolve) => {
      resolveSecondPage = resolve
    }))
    getFeed.mockClear()

    const first = loadMore()
    const second = loadMore()
    resolveSecondPage(makeResponse(['p2'], 'cursor-3', true))
    await Promise.all([first, second])

    expect(getFeed).toHaveBeenCalledTimes(1)
  })

  it('reports the API error and still resets loading state on failure', async () => {
    getFeed.mockRejectedValueOnce(new Error('network down'))
    const { isLoading, loadPosts } = usePosts()

    await loadPosts()

    expect(showApiError).toHaveBeenCalledTimes(1)
    expect(isLoading.value).toBe(false)
  })
})
