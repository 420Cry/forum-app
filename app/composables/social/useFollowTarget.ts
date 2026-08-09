import type { AccountType } from '~/types/profile'
import { useFollowsApi } from '~/composables/api/useFollowsApi'

export function useFollowTarget(
  targetType: MaybeRefOrGetter<AccountType>,
  targetId: MaybeRefOrGetter<string>,
) {
  const { follow, unfollow, status } = useFollowsApi()
  const following = ref(false)
  const busy = ref(false)
  const ready = ref(false)
  const user = useSupabaseUser()

  async function refreshStatus() {
    const id = toValue(targetId)
    if (!user.value?.id || !id) {
      following.value = false
      ready.value = true
      return
    }
    try {
      const res = await status(toValue(targetType), id)
      following.value = res.following
    }
    catch {
      following.value = false
    }
    finally {
      ready.value = true
    }
  }

  async function toggleFollow() {
    const id = toValue(targetId)
    if (!user.value?.id || !id || busy.value) return
    busy.value = true
    try {
      const type = toValue(targetType)
      const res = following.value
        ? await unfollow(type, id)
        : await follow(type, id)
      following.value = res.following
    }
    finally {
      busy.value = false
    }
  }

  return { following, busy, ready, refreshStatus, toggleFollow }
}
