// Right-rail discovery models (Suggested to follow + Trending Now).
export type suggestionType = {
  id: string
  name: string
  // Keyword tags describing the account, e.g. "Climate · Pre-seed" (not a job role).
  tags: string
  avatar?: string
}

// Badge is a single fixed category in this prototype.
export type trendingBadgeType = 'opportunity'

export type trendingType = {
  id: string
  // Prototype only: raw display strings — real copy will come from the API.
  title: string
  subtitle: string
  badge: trendingBadgeType
}
