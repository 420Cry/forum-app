import type { suggestionType, trendingType } from '~/types/discoveryType'

/* Has not thought of the API response shape but should return the discovery
   feed for the right rail: accounts to follow + trending items. */
const suggestionsExample = ref(
  (
    [
      { id: '1', name: 'Cardamom', tags: 'Climate · Pre-seed', avatar: '' },
      { id: '2', name: 'Marrow', tags: 'Diagnostics · Pre-seed', avatar: '' },
      { id: '3', name: 'North Bench Capital', tags: 'Angel syndicate', avatar: '' },
      { id: '4', name: 'Halen Type', tags: 'Design tools · Idea', avatar: '' },
    ] satisfies suggestionType[]
  ).map(suggestion => ({
    ...suggestion,
    prefix: suggestion.name
      .split(' ')
      .map(l => l[0])
      .join(''),
    avatarColor: getAvatarColor(suggestion.name),
    avatarLoadFailed: false,
  })),
)

const trendingExample = ref<trendingType[]>([
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
])

export const useDiscovery = () => {
  const followedIds = useState('followed-account-ids', () => new Set<string>())

  const isFollowed = (id: string) => followedIds.value.has(id)

  const handleFollow = (id: string) => {
    // Reassign to trigger reactivity on the Set.
    const next = new Set(followedIds.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    followedIds.value = next
  }

  const handleAvatarError = (name: string) => {
    const suggestion = suggestionsExample.value.find(s => s.name === name)
    if (suggestion) suggestion.avatarLoadFailed = true
  }

  return {
    suggestions: suggestionsExample,
    trending: trendingExample,
    isFollowed,
    handleFollow,
    handleAvatarError,
  }
}
