<script setup lang="ts">
import type { BaseMessage, UserMessage } from '@sendbird/chat/message'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import ChatDeliveryStatus from '~/components/chat/ChatDeliveryStatus.vue'
import ChatMessageReactions from '~/components/chat/ChatMessageReactions.vue'
import { useReactionPicker } from '~/composables/chat/useReactionPicker'
import {
  chatBubbleBorderRadius,
  formatChatDayLabel,
  formatChatTime,
  shouldShowDaySeparator,
} from '~/utils/chatPreview'
import {
  chatReactionSummaries,
  type ChatDeliveryStatus as DeliveryStatus,
} from '~/utils/chatStatus'

const props = defineProps<{
  message: BaseMessage
  previousCreatedAt: number | null
  myUserId: string
  chainTop?: boolean
  chainBottom?: boolean
  fileFallback: string
  deliveryStatus?: DeliveryStatus | null
  showDelivery?: boolean
}>()

const emit = defineEmits<{
  react: [emoji: string]
}>()

const { locale, t } = useI18n()

const bubbleRef = ref<HTMLElement | null>(null)
const wrapRef = ref<HTMLElement | null>(null)
const {
  open: pickerOpen,
  anchor,
  openPicker,
  onOpenUpdate,
  onPointerDown,
  onPointerUp,
  onContextMenu,
} = useReactionPicker({ bubbleRef, wrapRef })

const isMine = computed(
  () => (props.message as UserMessage).sender?.userId === props.myUserId,
)

const text = computed(() => {
  const msg = props.message as UserMessage
  if (msg.messageType === 'file') return props.fileFallback
  return msg.message?.trim() ?? ''
})

const showDay = computed(() =>
  shouldShowDaySeparator(props.message.createdAt, props.previousCreatedAt),
)
const time = computed(() => formatChatTime(props.message.createdAt, locale.value))
const day = computed(() => formatChatDayLabel(props.message.createdAt, locale.value))
const radius = computed(() =>
  chatBubbleBorderRadius(
    isMine.value,
    props.chainTop ?? false,
    props.chainBottom ?? false,
  ),
)
const reactions = computed(() =>
  chatReactionSummaries(
    (props.message as UserMessage).reactions,
    props.myUserId,
  ),
)
const showMeta = computed(() => props.showDelivery && !!props.deliveryStatus)
const hasReactions = computed(() => reactions.value.length > 0)
</script>

<template>
  <div ref="wrapRef">
    <div
      v-if="showDay"
      class="flex w-full justify-center py-3"
    >
      <span class="text-[11px] font-semibold tracking-[0.06em] uppercase text-ink-4">
        {{ day }}
      </span>
    </div>
    <div
      class="group/msg relative flex w-full"
      :class="[
        isMine ? 'justify-end' : 'justify-start',
        chainTop ? 'mt-1' : 'mt-2',
        hasReactions ? 'mb-1' : '',
      ]"
    >
      <div class="relative max-w-[min(400px,calc(100%-0.5rem))] sm:max-w-[min(400px,85%)]">
        <div
          ref="bubbleRef"
          class="flex w-fit flex-col gap-0.5 px-4 py-2 text-[15px] leading-snug wrap-break-word select-none md:select-text touch-manipulation"
          :class="
            isMine
              ? 'items-end bg-brand text-white'
              : 'items-stretch bg-surface-hover text-ink'
          "
          :style="{ borderRadius: radius }"
          @pointerdown.passive="onPointerDown"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @contextmenu="onContextMenu"
        >
          <p class="m-0 self-stretch">
            {{ text }}
          </p>
          <div
            class="flex items-center gap-1.5"
            :class="isMine ? 'justify-end' : 'justify-start'"
          >
            <span
              class="text-[11px] tabular-nums font-medium"
              :class="isMine ? 'text-white/70' : 'text-ink-4'"
            >
              {{ time }}
            </span>
            <ChatDeliveryStatus
              v-if="showMeta && deliveryStatus"
              :status="deliveryStatus"
              :class="isMine ? 'text-white/80' : 'text-ink-4'"
            />
          </div>
        </div>

        <button
          type="button"
          data-testid="chat-reaction-trigger"
          class="absolute top-1/2 z-10 hidden size-8 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-card text-ink-3 shadow-1 transition-all cursor-pointer hover:text-ink hover:bg-surface-hover opacity-0 scale-90 group-hover/msg:opacity-100 group-hover/msg:scale-100 focus-visible:opacity-100! focus-visible:scale-100! md:flex"
          :class="[
            isMine ? 'right-full mr-1.5' : 'left-full ml-1.5',
            pickerOpen ? 'opacity-100! scale-100!' : '',
          ]"
          :aria-label="t('chat.aria.add_reaction')"
          :aria-expanded="pickerOpen"
          :disabled="deliveryStatus === 'pending'"
          @click.stop="openPicker"
        >
          <BaseIcon
            name="addReaction"
            size="1.05em"
          />
        </button>

        <ChatMessageReactions
          :open="pickerOpen"
          :reactions="reactions"
          :align="isMine ? 'end' : 'start'"
          :anchor="anchor"
          @update:open="onOpenUpdate"
          @toggle="emit('react', $event)"
        />
      </div>
    </div>
  </div>
</template>
