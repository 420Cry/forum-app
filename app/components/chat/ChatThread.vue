<script setup lang="ts">
import type { BaseMessage, UserMessage } from '@sendbird/chat/message'
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import ChatComposer from '~/components/chat/ChatComposer.vue'
import ChatEmptyState from '~/components/chat/ChatEmptyState.vue'
import ChatMessageBubble from '~/components/chat/ChatMessageBubble.vue'
import { accountNamePrefix } from '~/utils/accountSummary'
import { getAvatarColor } from '~/utils/avatarColor'
import { isMessageChained } from '~/utils/chatPreview'
import type { ChatDeliveryStatus } from '~/utils/chatStatus'

const props = defineProps<{
  peerName: string
  peerId: string
  peerAvatar: string
  myUserId: string
  messages: BaseMessage[]
  sending: boolean
  error: boolean
  showBack: boolean
  deliveryStatusFor: (message: BaseMessage) => ChatDeliveryStatus | null
  receiptEpoch: number
}>()

const emit = defineEmits<{
  back: []
  send: [text: string]
  react: [message: BaseMessage, emoji: string]
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const listRef = ref<HTMLElement | null>(null)

const account = computed(() => ({
  id: props.peerId || props.peerName,
  avatar: props.peerAvatar,
  avatarLoadFailed: false,
  avatarColor: getAvatarColor(props.peerId || props.peerName),
  prefix: accountNamePrefix(props.peerName || '?'),
}))

const profileHref = computed(() => {
  const id = props.peerId.trim()
  if (!id) return null
  return localePath(`/u/${id}`)
})

const fileFallback = computed(() => t('chat.info.sent_file'))

function senderId(message: BaseMessage): string | null {
  return (message as UserMessage).sender?.userId ?? null
}

function previousCreatedAt(index: number): number | null {
  const prev = props.messages[index - 1]
  return prev ? prev.createdAt : null
}

function chainTop(index: number): boolean {
  const current = props.messages[index]
  const prev = props.messages[index - 1]
  if (!current || !prev) return false
  return isMessageChained(
    { createdAt: current.createdAt, senderId: senderId(current) },
    { createdAt: prev.createdAt, senderId: senderId(prev) },
  )
}

function chainBottom(index: number): boolean {
  const current = props.messages[index]
  const next = props.messages[index + 1]
  if (!current || !next) return false
  return isMessageChained(
    { createdAt: current.createdAt, senderId: senderId(current) },
    { createdAt: next.createdAt, senderId: senderId(next) },
  )
}

/** Delivery/seen ticks on every outgoing message. */
function showDelivery(index: number): boolean {
  const message = props.messages[index]
  return !!message && senderId(message) === props.myUserId
}

function statusFor(message: BaseMessage): ChatDeliveryStatus | null {
  void props.receiptEpoch
  return props.deliveryStatusFor(message)
}

watch(
  () => props.messages.length,
  async () => {
    await nextTick()
    const el = listRef.value
    if (el) el.scrollTop = el.scrollHeight
  },
)

function onAvatarError() {}
</script>

<template>
  <section class="flex min-h-0 flex-1 flex-col bg-card">
    <header class="flex shrink-0 items-center gap-1.5 border-b border-line p-2 sm:gap-3 sm:px-3 sm:py-2.5">
      <button
        v-if="showBack"
        type="button"
        class="flex size-10 shrink-0 items-center justify-center rounded-full border-0 bg-transparent text-ink-2 transition-colors hover:bg-surface-hover cursor-pointer"
        :aria-label="t('chat.action.back_to_list')"
        @click="emit('back')"
      >
        <BaseIcon
          name="leftArrow"
          size="1.35em"
        />
      </button>
      <NuxtLink
        v-if="profileHref"
        :to="profileHref"
        class="flex min-w-0 flex-1 items-center gap-2.5 rounded-md no-underline text-inherit p-1 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:gap-3"
        :aria-label="t('chat.aria.view_profile', { name: peerName })"
      >
        <AccountAvatar
          :account="account"
          size="size-9"
          text-class="text-xs"
          :handle-avatar-error="onAvatarError"
        />
        <h2 class="text-[15px] font-semibold text-ink truncate">
          {{ peerName }}
        </h2>
      </NuxtLink>
      <template v-else>
        <AccountAvatar
          :account="account"
          size="size-9"
          text-class="text-xs"
          :handle-avatar-error="onAvatarError"
        />
        <h2 class="text-[15px] font-semibold text-ink truncate">
          {{ peerName }}
        </h2>
      </template>
    </header>

    <div
      v-if="error"
      class="flex flex-1 items-center justify-center px-6 text-center text-sm text-ink-3"
    >
      {{ t('chat.error.thread') }}
    </div>
    <div
      v-else-if="messages.length === 0"
      class="flex min-h-0 flex-1 flex-col items-center justify-center px-4"
    >
      <ChatEmptyState
        :title="t('chat.info.no_messages_yet')"
        :description="t('chat.info.empty_thread', { name: peerName })"
        :show-icon="false"
      >
        <template #media>
          <div class="flex flex-col items-center gap-2.5">
            <AccountAvatar
              :account="account"
              size="size-16"
              text-class="text-lg"
              :handle-avatar-error="onAvatarError"
            />
            <p class="text-[13.5px] font-semibold text-ink">
              {{ peerName }}
            </p>
          </div>
        </template>
      </ChatEmptyState>
    </div>
    <div
      v-else
      ref="listRef"
      class="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden overscroll-contain p-3 sm:px-4"
    >
      <ChatMessageBubble
        v-for="(message, index) in messages"
        :key="String(message.reqId || message.messageId || index)"
        :message="message"
        :previous-created-at="previousCreatedAt(index)"
        :my-user-id="myUserId"
        :chain-top="chainTop(index)"
        :chain-bottom="chainBottom(index)"
        :file-fallback="fileFallback"
        :show-delivery="showDelivery(index)"
        :delivery-status="statusFor(message)"
        @react="emit('react', message, $event)"
      />
    </div>

    <ChatComposer
      :disabled="error"
      :busy="sending"
      @send="emit('send', $event)"
    />
  </section>
</template>
