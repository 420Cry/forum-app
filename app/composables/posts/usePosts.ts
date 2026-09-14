import type { Post, PostDto, PostResponseDto } from '~/types/post'
import type { ReactionType } from '~/types/reaction'
import type { AccountSummary, AccountSummaryView } from '~/types/profile'
import { usePostsApi } from '~/composables/api/usePostsApi'
import { useApiError } from '../api/useApiError'

const toAuthor = (author: AccountSummary): AccountSummaryView =>
  toAccountSummaryView(author)

const toPost = (post: PostDto): Post => ({
  id: post.id,
  content: post.content,
  imageUrl: post.imageUrl,
  time: formatRelativeTime(post.createdAt),
  visibility: post.visibility,
  reaction_counts: post.reactionInfo.total,
  top_reactions: calculateTopReactions(post.reactionInfo.counts),
  reactions: post.reactionInfo.counts,
  viewer_reaction: post.reactionInfo.viewerReaction,
  comments: 0,
  shares: 0,
  author: toAuthor(post.author),
  imageLoadFailed: false,
})

const calculateTopReactions = (
  reactions: Record<ReactionType, number>,
): ReactionType[] =>
  (Object.entries(reactions) as [ReactionType, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => key)

export const usePosts = () => {
  const { getFeed } = usePostsApi()
  const { showApiError } = useApiError()
  const posts = ref<Post[]>([])
  const cursor = ref<string | null>(null)
  const limit = ref<number>(5)
  const hasPosts = computed(() => posts.value.length > 0)
  const isLoading = ref<boolean>(true)
  const isLoadingMore = ref<boolean>(false)
  const hasMore = ref<boolean>(true)

  async function loadPosts(pageLimit?: number, pageCursor?: string) {
    isLoading.value = true
    try {
      const res: PostResponseDto = await getFeed(pageLimit, pageCursor)
      const rawPosts = res.items
      posts.value = rawPosts.map(rawPost => toPost(rawPost))
      cursor.value = res.hasMore ? res.nextCursor : null
      hasMore.value = res.hasMore
    }
    catch (err) {
      showApiError(err)
    }
    finally {
      isLoading.value = false
    }
  }

  async function loadMore() {
    if (!cursor.value || isLoadingMore.value || isLoading.value) return
    isLoadingMore.value = true
    try {
      const res: PostResponseDto = await getFeed(limit.value, cursor.value as string)
      const rawPosts = res.items
      posts.value = [...posts.value, ...rawPosts.map(rawPost => toPost(rawPost))]
      cursor.value = res.hasMore ? res.nextCursor : null
      hasMore.value = res.hasMore
    }
    catch (err) {
      showApiError(err)
    }
    finally {
      isLoadingMore.value = false
    }
  }

  const react = (postId: string, type: ReactionType) => {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const previous = post.viewer_reaction

    if (previous === type) {
      post.reactions[type] -= 1
      post.reaction_counts -= 1
      post.viewer_reaction = null
    }
    else {
      if (previous) post.reactions[previous] -= 1
      else post.reaction_counts += 1
      post.reactions[type] += 1
      post.viewer_reaction = type
    }

    post.top_reactions = calculateTopReactions(post.reactions)
  }

  const handleAvatarError = (authorId: string) => {
    const post = posts.value.find(p => p.author.id === authorId)
    if (post) post.author.avatarLoadFailed = true
  }

  const handlePostError = (postId: string) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) post.imageLoadFailed = true
  }

  return {
    posts,
    loadPosts,
    loadMore,
    react,
    handleAvatarError,
    handlePostError,
    hasPosts,
    cursor,
    limit,
    isLoading,
    isLoadingMore,
    hasMore,
  }
}
