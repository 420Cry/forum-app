/* const suggestions = ref(
  suggestionsExample.map(suggestion => ({
    ...suggestion,
    prefix: suggestion.name
      .split(' ')
      .map(l => l[0])
      .join(''),
    avatarColor: getAvatarColor(suggestion.name),
    avatarLoadFailed: false,
  })),
) */

const suggestions = ref([])
// const trending = ref<trendingType[]>(trendingExample)
const trending = ref([])
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

  const handleAvatarError = (id: string) => {
    const suggestion = suggestions.value.find(s => s.id === id)
    if (suggestion) suggestion.avatarLoadFailed = true
  }

  return {
    suggestions,
    trending,
    isFollowed,
    handleFollow,
    handleAvatarError,
  }
}
