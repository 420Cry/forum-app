import type { AccountSummaryView } from '~/types/profile'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import { toAccountSummaryView } from '~/utils/accountSummary'

export const useAccount = () => {
  const accounts = useState<AccountSummaryView[]>('forum-accounts', () => [])
  const accountsLoading = useState('forum-accounts-loading', () => false)
  const activeAccountId = useState<string | null>(
    'active-account-id',
    () => null,
  )

  /** Alias kept for AccountSwitcher / AppHeader compatibility. */
  const profileExample = accounts

  const activeAccount = computed(() => {
    return (
      accounts.value.find(p => p.id === activeAccountId.value)
      ?? accounts.value[0]
      ?? null
    )
  })

  async function refreshAccounts() {
    accountsLoading.value = true
    try {
      const { listAccounts } = useProfilesApi()
      const list = await listAccounts()
      accounts.value = list.map(toAccountSummaryView)
      if (
        !activeAccountId.value
        || !accounts.value.some(a => a.id === activeAccountId.value)
      ) {
        activeAccountId.value = accounts.value[0]?.id ?? null
      }
    }
    catch {
      // Keep prior accounts if refresh fails (e.g. offline).
    }
    finally {
      accountsLoading.value = false
    }
  }

  const handleActive = (accountId: string) => {
    activeAccountId.value = accountId
  }

  const handleAvatarError = (id: string) => {
    const profile = accounts.value.find(p => p.id === id)
    if (profile) profile.avatarLoadFailed = true
  }

  return {
    handleAvatarError,
    activeAccount,
    handleActive,
    profileExample,
    accounts,
    refreshAccounts,
    accountsLoading,
    activeAccountId,
  }
}
