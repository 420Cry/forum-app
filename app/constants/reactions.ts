import type { Reaction } from '~/types/reaction'

// This should be fetched from the backend and map to the composable
export const reactionList: Reaction[] = [
  {
    id: 1,
    key: 'back',
    name: 'Back',
    activeName: 'Backed',
  },
  {
    id: 2,
    key: 'watch',
    name: 'Watch',
    activeName: 'Watching',
  },
  {
    id: 3,
    key: 'signal',
    name: 'Signal',
    activeName: 'Signalled',
  },
  {
    id: 4,
    key: 'celebrate',
    name: 'Celebrate',
    activeName: 'Celebrated',
  },
  {
    id: 5,
    key: 'insight',
    name: 'Insight',
    activeName: 'Noted',
  },
]
