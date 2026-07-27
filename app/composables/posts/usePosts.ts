import type {
  Post,
  PostAuthor,
  PostAuthorDto,
  PostDto,
  PostReactionsDto,
} from '~/types/post'
import { postExample as postExampleData } from '~/constants/posts'
import type { ReactionType } from '~/types/reaction'

/* Add client-derived/managed fields to the raw author. */
const toAuthor = (author: PostAuthorDto): PostAuthor => ({
  ...author,
  prefix: author.name
    .split(' ')
    .map(word => word[0])
    .join(''),
  avatarColor: getAvatarColor(author.name),
  avatarLoadFailed: false,
})

/* Map the raw API post into the `Post` view shape the feed cards consume. */
const toPost = (post: PostDto): Post => ({
  id: post.id,
  content: post.content,
  imageUrl: post.image_url,
  time: formatRelativeTime(post.created_at),
  visibility: post.visibility,
  reaction_counts: post.reaction_counts,
  top_reactions: calculateTopReactions(post.reactions),
  reactions: post.reactions,
  reacted_type: post.reacted_type,
  comments: post.comments_count,
  shares: post.shares_count,
  author: toAuthor(post.author),
  imageLoadFailed: false,
})

const calculateTopReactions = (reactions: PostReactionsDto): ReactionType[] =>
  (Object.entries(reactions) as [ReactionType, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => key)

export const usePosts = () => {
  const posts = ref<Post[]>([])
  const formattedPosts = postExampleData.map(toPost)

  // `posts` is the single source of truth; the empty state derives from it.
  const hasPosts = computed(() => posts.value.length > 0)

  // Dev scaffold: load/clear the mock feed until the real fetch lands.
  // Replace with a `loadPosts()` that assigns the API response to `posts`.
  const togglePost = () => {
    posts.value = posts.value.length ? [] : formattedPosts
  }

  /* Apply a reaction to a post, keeping the breakdown, aggregate count and
     top_reactions in sync. Clicking the current reaction toggles it off. */
  const react = (postId: string, type: ReactionType) => {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return

    const previous = post.reacted_type

    if (previous === type) {
      post.reactions[type] -= 1
      post.reaction_counts -= 1
      post.reacted_type = null
    }
    else {
      if (previous) post.reactions[previous] -= 1
      else post.reaction_counts += 1
      post.reactions[type] += 1
      post.reacted_type = type
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
    react,
    handleAvatarError,
    handlePostError,
    hasPosts,
    togglePost,
  }
}
