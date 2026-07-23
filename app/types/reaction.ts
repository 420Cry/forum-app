export const REACTION_TYPES = [
  'back',
  'watch',
  'signal',
  'celebrate',
  'insight',
] as const
export type ReactionType = (typeof REACTION_TYPES)[number]
export type Reaction = {
  id: number
  key: ReactionType
  name: string
  activeName: string
}
