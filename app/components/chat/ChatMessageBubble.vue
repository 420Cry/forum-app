<script setup lang="ts">
import type { BaseMessage, UserMessage } from '@sendbird/chat/message'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import ChatDeliveryStatus from '~/components/chat/ChatDeliveryStatus.vue'
import ChatMessageReactions from '~/components/chat/ChatMessageReactions.vue'
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

const showMeta = computed(
  () => props.showDelivery && !!props.deliveryStatus,
)

const hasReactions = computed(() => reactions.value.length > 0)

const pickerOpen = ref(false)
const bubbleRef = ref<HTMLElement | null>(null)
const wrapRef = ref<HTMLElement | null>(null)
const anchor = ref<{ left: number, right: number, top: number, bottom: number } | null>(null)
let ignoreCloseUntil = 0
let longPressTimer: ReturnType<typeof setTimeout> | null = null
let scrollRoot: HTMLElement | null = null

function clearLongPress() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
}

function measureAnchor() {
  const el = bubbleRef.value
  if (!el) return
  const box = el.getBoundingClientRect()
  anchor.value = {
    left: box.left,
    right: box.right,
    top: box.top,
    bottom: box.bottom,
  }
}

function openPicker() {
  measureAnchor()
  ignoreCloseUntil = Date.now() + 400
  pickerOpen.value = true
}

function closePicker(reason: string) {
  if (!pickerOpen.value) return
  if (reason !== 'scroll' && Date.now() < ignoreCloseUntil) return
  pickerOpen.value = false
}

function onPickerOpenUpdate(value: boolean) {
  if (value) openPicker()
  else closePicker('child')
}

function onPointerDown() {
  clearLongPress()
  longPressTimer = setTimeout(() => {
    longPressTimer = null
    openPicker()
  }, 450)
}

function onPointerUp() {
  clearLongPress()
}

function onContextMenu(event: Event) {
  event.preventDefault()
  openPicker()
}

function onScrollClose() {
  closePicker('scroll')
}

function findScrollRoot(): HTMLElement | null {
  let node = wrapRef.value?.parentElement ?? null
  while (node) {
    const style = getComputedStyle(node)
    if (/(auto|scroll)/.test(style.overflowY)) return node
    node = node.parentElement
  }
  return null
}

onMounted(() => {
  scrollRoot = findScrollRoot()
  scrollRoot?.addEventListener('scroll', onScrollClose, { passive: true })
  window.addEventListener('scroll', onScrollClose, { passive: true })
})

onUnmounted(() => {
  clearLongPress()
  scrollRoot?.removeEventListener('scroll', onScrollClose)
  window.removeEventListener('scroll', onScrollClose)
})

function onReactToggle(emoji: string) {
  emit('react', emoji)
}
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

        <!-- Desktop hover react -->
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
          @update:open="onPickerOpenUpdate"
          @toggle="onReactToggle"
        />
      </div>
    </div>
  </div>
</template>
