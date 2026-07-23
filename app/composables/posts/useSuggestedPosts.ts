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
  reaction_counts: post.reaction_counts,
  top_reactions: calculateTopReactions(post.reactions),
  reactions: post.reactions,
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

const suggestedPosts = ref<Post[]>([])

const hasPosts = ref<boolean>(false)
watch(hasPosts, (value) => {
  if (value) {
    suggestedPosts.value = postExampleData.map(toPost)
  }
  else {
    suggestedPosts.value = []
  }
})

export const useSuggestedPosts = () => {
  const handleAvatarError = (authorId: string) => {
    const post = suggestedPosts.value.find(p => p.author.id === authorId)
    if (post) post.author.avatarLoadFailed = true
  }

  const handlePostError = (postId: string) => {
    const post = suggestedPosts.value.find(p => p.id === postId)
    if (post) post.imageLoadFailed = true
  }

  const togglePost = () => {
    hasPosts.value = !hasPosts.value
  }

  return {
    suggestedPosts,
    handleAvatarError,
    handlePostError,
    hasPosts,
    togglePost,
  }
}
