import type { AccountSummary, AccountSummaryView } from './profile'
import type { ReactionType } from './reaction'

export const POST_VISIBILITIES = ['public', 'private'] as const

export type PostVisibility = (typeof POST_VISIBILITIES)[number]

export type ReactionsDto = {
  total: number
  counts: Record<ReactionType, number>
  viewerReaction: ReactionType | null
}

export type PostDto = {
  id: string
  content: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string | null
  visibility: PostVisibility
  reactionInfo: ReactionsDto
  author: AccountSummary
}

export type PostResponseDto = {
  items: PostDto[]
  nextCursor: string | null
  hasMore: boolean
}

export type Post = {
  id: string
  content: string
  imageUrl: string | null
  time: string
  visibility: PostVisibility
  reaction_counts: number
  top_reactions: ReactionType[]
  reactions: Record<ReactionType, number>
  viewer_reaction: ReactionType | null
  comments: number | null
  shares: number | null
  author: AccountSummaryView
  imageLoadFailed: boolean
}
