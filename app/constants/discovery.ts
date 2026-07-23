import type { suggestionType, trendingType } from '~/types/discoveryType'

/* Mock discovery feed for the right rail — accounts to follow + trending items.
   API response shape is not finalized yet. */
export const suggestionsExample: suggestionType[] = [
  { id: '1', name: 'Cardamom', tags: 'Climate · Pre-seed', avatar: '' },
  { id: '2', name: 'Marrow', tags: 'Diagnostics · Pre-seed', avatar: '' },
  { id: '3', name: 'North Bench Capital', tags: 'Angel syndicate', avatar: '' },
  { id: '4', name: 'Halen Type', tags: 'Design tools · Idea', avatar: '' },
]

export const trendingExample: trendingType[] = [
  {
    id: '1',
    title: 'Marrow is raising a pre-seed round',
    subtitle: 'Diagnostics · Lisbon · open to intro',
    badge: 'opportunity',
  },
  {
    id: '2',
    title: 'Tidewater opens sensor pilot slots',
    subtitle: 'Climate / Marine · 3 spots remaining',
    badge: 'opportunity',
  },
  {
    id: '3',
    title: 'North Bench Capital: climate hardware Q3',
    subtitle: 'Investor · writing $50k–$200k',
    badge: 'opportunity',
  },
]
