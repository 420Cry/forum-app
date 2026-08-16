<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'

const props = defineProps<{
  /** Hard-disable input (e.g. thread failed to load). */
  disabled?: boolean
  /** In-flight send — block submit but keep focus. */
  busy?: boolean
}>()

const emit = defineEmits<{
  send: [text: string]
}>()

const { t } = useI18n()
const draft = ref('')
const inputRef = ref<HTMLTextAreaElement | null>(null)

async function submit() {
  const text = draft.value.trim()
  if (!text || props.disabled || props.busy) return
  emit('send', text)
  draft.value = ''
  await nextTick()
  inputRef.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    void submit()
  }
}
</script>

<template>
  <form
    class="flex shrink-0 items-end gap-2 border-t border-line bg-card p-2.5 sm:p-3 pb-[max(0.625rem,env(safe-area-inset-bottom,0px))] sm:pb-3"
    @submit.prevent="submit"
  >
    <label
      class="sr-only"
      for="chat-composer"
    >
      {{ t('chat.label.type_message') }}
    </label>
    <textarea
      id="chat-composer"
      ref="inputRef"
      v-model="draft"
      rows="1"
      :placeholder="t('chat.label.type_message')"
      :disabled="disabled"
      class="min-h-10 max-h-32 flex-1 resize-none rounded-pill border border-line bg-surface-hover px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-4 focus:border-brand focus:outline-none disabled:opacity-60"
      @keydown="onKeydown"
    />
    <button
      type="button"
      tabindex="-1"
      class="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0"
      :disabled="disabled || busy || !draft.trim()"
      :aria-label="t('chat.aria.send')"
      @click="submit"
    >
      <BaseIcon
        name="send"
        size="1.15em"
        class="text-white"
      />
    </button>
  </form>
</template>
