<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import type { AccountType } from '~/types/profile'
import { useFollowTarget } from '~/composables/social/useFollowTarget'

const props = withDefaults(
  defineProps<{
    targetType: AccountType
    targetId: string
    /** Stretch to parent width (directory result actions). */
    block?: boolean
  }>(),
  { block: false },
)

const { t } = useI18n()
const user = useSupabaseUser()
const { following, busy, ready, refreshStatus, toggleFollow } = useFollowTarget(
  () => props.targetType,
  () => props.targetId,
)

onMounted(() => {
  void refreshStatus()
})

watch(
  () => [props.targetType, props.targetId, user.value?.id] as const,
  () => {
    void refreshStatus()
  },
)
</script>

<template>
  <BaseButton
    v-if="user"
    :intent="following ? 'secondary' : 'primary-outline'"
    size="sm"
    :block="block"
    :disabled="busy || !ready"
    @click="toggleFollow"
  >
    {{
      following
        ? t('social.action.unfollow')
        : t('social.action.follow')
    }}
  </BaseButton>
</template>
