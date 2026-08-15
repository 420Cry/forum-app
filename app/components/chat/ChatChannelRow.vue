<script setup lang="ts">
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import type { ChatListItem } from '~/types/chat'
import { accountNamePrefix } from '~/utils/accountSummary'
import { getAvatarColor } from '~/utils/avatarColor'
import { formatChatListTime } from '~/utils/chatPreview'

const props = defineProps<{
  item: ChatListItem
  active: boolean
}>()

const { t, locale } = useI18n()

const account = computed(() => ({
  id: props.item.peer.userId || props.item.url,
  avatar: props.item.peer.profileUrl,
  avatarLoadFailed: false,
  avatarColor: getAvatarColor(props.item.peer.userId || props.item.url),
  prefix: accountNamePrefix(props.item.peer.nickname || '?'),
}))

const time = computed(() =>
  formatChatListTime(
    props.item.lastMessageAt,
    locale.value,
    t('chat.info.yesterday'),
  ),
)

function onAvatarError() {
  // Avatar fallback is handled by AccountAvatar's load-failed path via a copy.
}
</script>

<template>
  <button
    type="button"
    class="flex w-full items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors cursor-pointer border-0 bg-transparent"
    :class="
      active
        ? 'bg-brand-tint'
        : 'hover:bg-surface-hover'
    "
  >
    <AccountAvatar
      :account="account"
      size="size-10"
      text-class="text-sm"
      :handle-avatar-error="onAvatarError"
    />
    <div class="min-w-0 flex-1">
      <div class="flex items-baseline justify-between gap-2">
        <span class="text-[13.5px] font-semibold text-ink truncate">
          {{ item.peer.nickname }}
        </span>
        <span class="text-[11px] text-ink-4 shrink-0 tabular-nums">
          {{ time }}
        </span>
      </div>
      <div class="flex items-center gap-2 mt-0.5">
        <p class="text-[12.5px] text-ink-3 truncate min-w-0 flex-1">
          {{ item.lastMessage || t('chat.info.no_messages_yet') }}
        </p>
        <span
          v-if="item.unread > 0"
          class="ml-auto flex min-w-4.5 h-4.5 items-center justify-center rounded-pill bg-brand px-1 text-[10px] font-semibold text-white shrink-0"
        >
          {{ item.unread > 99 ? '99+' : item.unread }}
        </span>
      </div>
    </div>
  </button>
</template>
