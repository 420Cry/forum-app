export type AccountType = 'user' | 'startup' | 'investor'

/** Person-to-person follow state for chat contact search. */
export type FollowRelation = 'mutual' | 'following' | 'follower'

export type AccountSummary = {
  id: string
  name: string
  headline: string | null
  location: string | null
  avatarUrl: string | null
  /** Ready-to-use app path from API (e.g. `/u/dao-nguyen`). */
  href: string
  urlKey?: string
  views?: number
  connections?: number
  accountType: AccountType
}

/** User network row for messaging search. */
export type UserConnection = AccountSummary & {
  relation: FollowRelation
}

export type AccountSummaryView = AccountSummary & {
  prefix: string
  avatarColor: string
  avatarLoadFailed: boolean
  subtitle: string
  avatar: string
}

export type StartupProfile = {
  id: string
  userId: string
  companyName: string
  description: string | null
  stage: string
  industry: string
  websiteUrl: string | null
  contactEmail: string
  avatarUrl: string | null
  logoUrl: string | null
  foundedAt: string
  views: number
  connections: number
  followersCount?: number
  href: string
}

export type InvestorProfile = {
  id: string
  userId: string
  firmName: string
  description: string | null
  industry: string
  contactEmail: string
  avatarUrl: string | null
  logoUrl: string | null
  websiteUrl: string | null
  minInvestmentUsd: number | null
  maxInvestmentUsd: number | null
  views: number
  connections: number
  followersCount?: number
  href: string
}

export type PublicUserProfile = {
  id: string
  urlKey: string
  profilePath: string
  name: string | null
  role: 'Founder' | 'Investor' | null
  /** Display label from API (English catalog name). */
  occupation: string | null
  occupationKey?: string | null
  /** Display label from API (city / fixed seed). */
  location: string | null
  locationKey?: string | null
  avatarUrl: string | null
  /** Goal tag keys — translate via onboard.heading.goal_*. */
  goals: string[]
  followersCount?: number
  followingCount?: number
}

export type FindResults = {
  users: PublicUserProfile[]
  startups: StartupProfile[]
  investors: InvestorProfile[]
}

export type StartupProfilePayload = {
  companyName: string
  description?: string
  stage: string
  industry: string
  websiteUrl?: string
  contactEmail: string
  avatarUrl?: string
  logoUrl?: string
  foundedAt: string
}

export type InvestorProfilePayload = {
  firmName: string
  description?: string
  industry: string
  contactEmail: string
  avatarUrl?: string
  logoUrl?: string
  websiteUrl?: string
  minInvestmentUsd?: number
  maxInvestmentUsd?: number
}

export const startupStages = [
  'pre_seed',
  'seed',
  'series_a',
  'growth',
  'scale',
  'exit',
] as const
