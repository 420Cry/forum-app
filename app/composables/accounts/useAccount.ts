import type { AccountSummaryView } from '~/types/profile'
import { profileExample as profileExampleData } from '~/constants/profiles'

const profileExample = ref<AccountSummaryView[]>(
  profileExampleData.map(profile => ({
    ...profile,
    prefix: profile.name
      .split(' ')
      .map(l => l[0])
      .join(''),
    avatarColor: getAvatarColor(profile.name),
    avatarLoadFailed: false,
  })),
)

/* API response shape for subscription */
const isUserPaid = true

export const useAccount = () => {
  const activeAccountId = useState(
    'active-account-id',
    (): null | string => '1',
  )

  const activeAccount = computed(() => {
    return profileExample.value.find(p => p.id === activeAccountId.value)
  })

  const handleActive = (accountId: string) => {
    activeAccountId.value = accountId
  }

  const handleAvatarError = (id: string) => {
    const profile = profileExample.value.find(p => p.id === id)
    if (profile) profile.avatarLoadFailed = true
  }

  return {
    handleAvatarError,
    activeAccount,
    handleActive,
    profileExample,
    activeAccountId,
    isUserPaid,
  }
}
