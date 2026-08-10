<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import type { AccountType } from '~/types/profile'
import { useFollowTarget } from '~/composables/social/useFollowTarget'

const props = withDefaults(
  defineProps<{
    targetType: AccountType
    targetId: string
    /** Owner of a startup/investor page — hide follow when it is the viewer. */
    ownerUserId?: string | null
    /** Stretch to parent width (directory result actions). */
    block?: boolean
  }>(),
  { block: false, ownerUserId: null },
)

const { t } = useI18n()
const user = useSupabaseUser()
const { profile: me } = useUserProfile()
const emit = defineEmits<{
  change: [following: boolean]
}>()

const isSelf = computed(() => {
  const uid = user.value?.id ?? me.value?.id ?? null
  if (!uid) return false
  if (props.targetType === 'user') return props.targetId === uid
  return !!props.ownerUserId && props.ownerUserId === uid
})

const isSignedIn = computed(() => !!user.value?.id || !!me.value?.id)

const { following, busy, ready, refreshStatus, toggleFollow } = useFollowTarget(
  () => props.targetType,
  () => props.targetId,
)

async function onToggle() {
  const wasFollowing = following.value
  await toggleFollow()
  if (following.value !== wasFollowing) {
    emit('change', following.value)
  }
}

onMounted(() => {
  if (!isSelf.value) void refreshStatus()
})

watch(
  () => [props.targetType, props.targetId, user.value?.id, me.value?.id] as const,
  () => {
    if (!isSelf.value) void refreshStatus()
  },
)
</script>

<template>
  <BaseButton
    v-if="isSignedIn && !isSelf"
    :intent="following ? 'secondary' : 'primary-outline'"
    size="sm"
    :block="block"
    :disabled="busy || !ready"
    @click="onToggle"
  >
    {{
      following
        ? t('social.action.unfollow')
        : t('social.action.follow')
    }}
  </BaseButton>
</template>
