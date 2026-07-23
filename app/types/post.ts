// Minimal author summary a feed card needs — NOT the full profile shape.
// Only startup/investor accounts can post; headline is the composed "role"
// line (e.g. "Founder · Cardamom").

import type { ReactionType } from './reaction'

export const STARTUP_STAGES = [
  'pre_seed',
  'seed',
  'series_a',
  'growth',
  'scale',
  'exit',
] as const

export type StartupStage = (typeof STARTUP_STAGES)[number]

// Display labels for funding stages — sentence case per the design system Pill
// spec. BasePill derives its label from author.stage via this map.
export const STARTUP_STAGE_LABELS: Record<StartupStage, string> = {
  pre_seed: 'Pre-seed',
  seed: 'Seed',
  series_a: 'Series A',
  growth: 'Growth',
  scale: 'Scale',
  exit: 'Exit',
}

type RawPostAuthor = {
  id: string
  name: string
  headline: string
  avatar: string | null
}

type StartupAuthor = {
  accountType: 'startup'
  stage: StartupStage
}

type InvestorAuthor = {
  accountType: 'investor'
}

export type PostAuthorDto
  = | (RawPostAuthor & StartupAuthor)
    | (RawPostAuthor & InvestorAuthor)

// Per-reaction breakdown plus the aggregate count (wire shape).
export type PostReactionsDto = {
  back: number
  watch: number
  signal: number
  celebrate: number
  insight: number
}

// Raw post as sent by forum-api (snake_case = wire contract).
export type PostDto = {
  id: string
  content: string
  image_url: string | null
  created_at: string
  updated_at: string | null
  reaction_counts: number
  reactions: PostReactionsDto
  comments_count: number
  shares_count: number
  author: PostAuthorDto
}

// Author as a card consumes it: DTO plus client-derived/managed fields.
export type PostAuthor = PostAuthorDto & {
  prefix: string // initials derived from name
  avatarColor: string // derived from name
  avatarLoadFailed: boolean
}

// Post as a card consumes it: camelCase, counts flattened, time formatted.
export type Post = {
  id: string
  content: string
  imageUrl: string | null
  time: string // formatted from created_at, e.g. "2h"
  reaction_counts: number
  top_reactions: ReactionType[]
  reactions: PostReactionsDto
  comments: number
  shares: number
  author: PostAuthor
  imageLoadFailed: boolean
}
