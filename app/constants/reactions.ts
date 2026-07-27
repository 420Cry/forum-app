import type { Reaction, ReactionType } from '~/types/reaction'

// This should be fetched from the backend and map to the composable
export const reactionList: Reaction[] = [
  {
    id: 1,
    key: 'back',
    name: 'Back',
    activeName: 'Backed',
    activeColor: 'text-reaction-backed',
  },
  {
    id: 2,
    key: 'watch',
    name: 'Watch',
    activeName: 'Watching',
    activeColor: 'text-reaction-watch',
  },
  {
    id: 3,
    key: 'signal',
    name: 'Signal',
    activeName: 'Signalled',
    activeColor: 'text-reaction-signal',
  },
  {
    id: 4,
    key: 'celebrate',
    name: 'Celebrate',
    activeName: 'Celebrated',
    activeColor: 'text-reaction-celebrate',
  },
  {
    id: 5,
    key: 'insight',
    name: 'Insight',
    activeName: 'Noted',
    activeColor: 'text-reaction-insight',
  },
]

// The reaction offered before the user has picked one.
export const defaultReaction = reactionList.find(r => r.key === 'back')

// Presentation lookups by key — pure, no post state involved.
export const reactionActiveName = (key: ReactionType): string | undefined =>
  reactionList.find(r => r.key === key)?.activeName

export const reactionActiveColor = (key: ReactionType): string | undefined =>
  reactionList.find(r => r.key === key)?.activeColor
