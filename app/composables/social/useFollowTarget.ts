import type { AccountType } from '~/types/profile'
import { useFollowsApi } from '~/composables/api/useFollowsApi'

export function useFollowTarget(
  targetType: MaybeRefOrGetter<AccountType>,
  targetId: MaybeRefOrGetter<string>,
) {
  const { follow, unfollow, status } = useFollowsApi()
  const { t } = useI18n()
  const toast = useToast()
  const following = ref(false)
  const busy = ref(false)
  const ready = ref(false)
  const user = useSupabaseUser()
  const { profile: me } = useUserProfile()

  function viewerId() {
    return user.value?.id ?? me.value?.id ?? null
  }

  function isSelfTarget(type: AccountType, id: string) {
    const uid = viewerId()
    return type === 'user' && !!uid && id === uid
  }

  async function refreshStatus() {
    const id = toValue(targetId)
    const type = toValue(targetType)
    if (!viewerId() || !id || isSelfTarget(type, id)) {
      following.value = false
      ready.value = true
      return
    }
    try {
      const res = await status(type, id)
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
    const type = toValue(targetType)
    if (!viewerId() || !id || busy.value || isSelfTarget(type, id)) return
    const wasFollowing = following.value
    busy.value = true
    try {
      const res = wasFollowing
        ? await unfollow(type, id)
        : await follow(type, id)
      following.value = res.following
      toast.showSuccess(
        res.following
          ? t('social.info.followed_toast')
          : t('social.info.unfollowed_toast'),
        2000,
      )
    }
    catch {
      toast.showError(t('social.error.follow_failed'))
    }
    finally {
      busy.value = false
    }
  }

  return { following, busy, ready, refreshStatus, toggleFollow }
}
