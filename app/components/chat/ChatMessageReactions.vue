<script setup lang="ts">
import { CHAT_QUICK_EMOJIS, type ChatReactionSummary } from '~/utils/chatStatus'

const props = defineProps<{
  reactions: ChatReactionSummary[]
  align: 'start' | 'end'
  open: boolean
  anchor?: { left: number, right: number, top: number, bottom: number } | null
}>()

const emit = defineEmits<{
  'toggle': [emoji: string]
  'update:open': [value: boolean]
}>()

const { t } = useI18n()
const rootRef = ref<HTMLElement | null>(null)
const pickerRef = ref<HTMLElement | null>(null)

const hasReactions = computed(() => props.reactions.length > 0)

/** Compact bar width — avoid near-full-bleed 320px strip on phone. */
const pickerStyle = computed(() => {
  const pad = 12
  const vw = import.meta.client ? window.innerWidth : 390
  const estimatedWidth = Math.min(vw - pad * 2, 280)
  const anchor = props.anchor
  let left = pad
  let top = 80

  if (anchor) {
    const center = (anchor.left + anchor.right) / 2
    left = Math.round(center - estimatedWidth / 2)
    left = Math.max(pad, Math.min(left, vw - estimatedWidth - pad))
    // Prefer above the bubble; if too close to the top, place below.
    const above = Math.round(anchor.top - 56)
    top = above >= pad ? above : Math.round(anchor.bottom + 8)
  }

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${estimatedWidth}px`,
  }
})

function close() {
  emit('update:open', false)
}

function onDocPointer(event: PointerEvent) {
  if (!props.open) return
  const picker = pickerRef.value
  const root = rootRef.value
  const target = event.target as Node
  if (picker?.contains(target) || root?.contains(target)) return
  close()
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer)
  document.addEventListener('keydown', onKey)
})

onUnmounted(() => {
  document.removeEventListener('pointerdown', onDocPointer)
  document.removeEventListener('keydown', onKey)
})

function pick(emoji: string) {
  emit('toggle', emoji)
  close()
}
</script>

<template>
  <div ref="rootRef">
    <div
      v-if="hasReactions"
      class="mt-1 flex"
      :class="align === 'end' ? 'justify-end' : 'justify-start'"
    >
      <div
        class="inline-flex items-center gap-0.5 rounded-full border border-line bg-card px-1 py-0.5 shadow-1"
        role="list"
      >
        <button
          v-for="reaction in reactions"
          :key="reaction.key"
          type="button"
          role="listitem"
          data-testid="chat-reaction-chip"
          class="inline-flex min-w-6 items-center justify-center gap-0.5 rounded-full px-1 py-0.5 text-[13px] leading-none transition-transform active:scale-95 hover:scale-110 cursor-pointer border-0 bg-transparent"
          :class="reaction.reactedByMe ? 'bg-brand-tint' : ''"
          :aria-label="t('chat.aria.reaction', { emoji: reaction.key, count: reaction.count })"
          :aria-pressed="reaction.reactedByMe"
          @click.stop="emit('toggle', reaction.key)"
        >
          <span aria-hidden="true">{{ reaction.key }}</span>
          <span
            v-if="reaction.count > 1"
            class="text-[10px] font-semibold tabular-nums text-ink-3"
          >
            {{ reaction.count }}
          </span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="open"
        ref="pickerRef"
        data-testid="chat-reaction-picker"
        class="fixed z-80 flex items-center justify-evenly gap-0.5 rounded-full border border-line bg-card px-2 py-1.5 shadow-2"
        :style="pickerStyle"
        role="listbox"
        :aria-label="t('chat.aria.reaction_picker')"
        @pointerdown.stop
      >
        <button
          v-for="emoji in CHAT_QUICK_EMOJIS"
          :key="emoji"
          type="button"
          role="option"
          class="flex size-9 shrink-0 items-center justify-center rounded-full text-[1.35rem] leading-none transition-transform hover:scale-125 active:scale-110 cursor-pointer border-0 bg-transparent"
          :aria-label="t('chat.aria.react_with', { emoji })"
          @click.stop="pick(emoji)"
        >
          {{ emoji }}
        </button>
      </div>
    </Teleport>
  </div>
</template>
