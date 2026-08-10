import { useFollowsApi } from '~/composables/api/useFollowsApi'
import type { AccountType } from '~/types/profile'
import { toAccountSummaryView } from '~/utils/accountSummary'

type FollowListMode
  = | {
    mode: 'followers'
    targetType: AccountType
    targetId: MaybeRefOrGetter<string>
  }
  | { mode: 'following', userId: MaybeRefOrGetter<string> }

export function useFollowListPage(options: FollowListMode) {
  const { listFollowers, listFollowingForUser } = useFollowsApi()

  const loading = ref(true)
  const loadError = ref(false)
  const items = ref<ReturnType<typeof toAccountSummaryView>[]>([])

  function resolveId() {
    return options.mode === 'followers'
      ? toValue(options.targetId)
      : toValue(options.userId)
  }

  async function load() {
    const id = resolveId()
    if (!id) {
      loading.value = true
      return
    }
    loading.value = true
    loadError.value = false
    try {
      const list
        = options.mode === 'followers'
          ? await listFollowers(options.targetType, id)
          : await listFollowingForUser(id)
      items.value = list.map(toAccountSummaryView)
    }
    catch {
      items.value = []
      loadError.value = true
    }
    finally {
      loading.value = false
    }
  }

  function onFollowChange(payload: {
    targetType: AccountType
    targetId: string
    following: boolean
  }) {
    if (payload.following) return
    items.value = items.value.filter(
      item =>
        !(item.accountType === payload.targetType && item.id === payload.targetId),
    )
  }

  onMounted(() => {
    void load()
  })

  watch(resolveId, (id, prev) => {
    if (id && id !== prev) void load()
  })

  return { loading, loadError, items, load, onFollowChange }
}
