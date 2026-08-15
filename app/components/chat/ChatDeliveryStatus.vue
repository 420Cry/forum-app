<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'
import type { ChatDeliveryStatus } from '~/utils/chatStatus'

const props = defineProps<{
  status: ChatDeliveryStatus
}>()

const { t } = useI18n()

const label = computed(() => {
  switch (props.status) {
    case 'pending':
      return t('chat.aria.status_pending')
    case 'failed':
      return t('chat.aria.status_failed')
    case 'sent':
      return t('chat.aria.status_sent')
    case 'delivered':
      return t('chat.aria.status_delivered')
    case 'seen':
      return t('chat.aria.status_seen')
    default:
      return t('chat.aria.status_sent')
  }
})
</script>

<template>
  <span
    class="inline-flex items-center"
    :aria-label="label"
    :title="label"
  >
    <span
      v-if="status === 'pending'"
      class="size-1.5 rounded-full bg-current opacity-70"
      aria-hidden="true"
    />
    <BaseIcon
      v-else-if="status === 'failed'"
      name="close"
      size="0.85em"
      class="opacity-90"
    />
    <BaseIcon
      v-else-if="status === 'sent'"
      name="check"
      size="0.95em"
      class="opacity-70"
    />
    <BaseIcon
      v-else-if="status === 'delivered'"
      name="doneAll"
      size="0.95em"
      class="opacity-80"
    />
    <BaseIcon
      v-else
      name="doneAll"
      size="0.95em"
      class="text-sky-300"
    />
  </span>
</template>
