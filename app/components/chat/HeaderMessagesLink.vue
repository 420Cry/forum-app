<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'
import { useUnreadCount } from '~/composables/chat/useUnreadCount'

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { unread, start, stop, refresh } = useUnreadCount()

const isActive = computed(() =>
  route.path.includes('/messages'),
)

onMounted(() => {
  start()
})

onUnmounted(() => {
  stop()
})

watch(
  () => route.path,
  (path) => {
    if (path.includes('/messages')) void refresh()
  },
)

const badge = computed(() => {
  if (unread.value <= 0) return ''
  return unread.value > 99 ? '99+' : String(unread.value)
})
</script>

<template>
  <NuxtLink
    :to="localePath('/messages')"
    class="relative flex size-10 items-center justify-center rounded-full text-ink-3 no-underline transition-colors hover:bg-surface-hover hover:text-ink"
    :class="{ 'text-brand bg-brand-tint': isActive }"
    :aria-label="t('chat.aria.messages')"
    data-testid="header-messages"
  >
    <BaseIcon
      name="chat"
      size="1.25em"
    />
    <span
      v-if="badge"
      class="absolute top-1 right-1 flex min-w-4 h-4 items-center justify-center rounded-pill border-2 border-card bg-accent px-1 text-[10px] font-semibold text-white"
      :aria-label="t('chat.aria.unread', { count: unread })"
    >
      {{ badge }}
    </span>
  </NuxtLink>
</template>
