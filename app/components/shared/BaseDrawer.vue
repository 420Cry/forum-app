<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'

const open = defineModel<boolean>('open', { default: false })

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

function close() {
  open.value = false
  emit('close')
}

watch(open, (isOpen) => {
  if (!import.meta.client) return
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-80 bg-ink/40"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      leave-active-class="transition-transform duration-200 ease-in"
      enter-from-class="translate-x-full"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="open"
        class="fixed inset-y-0 right-0 z-80 flex w-full max-w-md flex-col bg-card shadow-pop"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <header class="flex flex-none items-center gap-3 border-b border-line px-5 py-4">
          <h2 class="min-w-0 flex-1 text-[16px] font-semibold text-ink">
            {{ title }}
          </h2>
          <button
            type="button"
            class="inline-flex size-9 flex-none items-center justify-center rounded-pill text-ink-3 hover:bg-surface-hover cursor-pointer"
            :aria-label="$t('common.aria.dismiss')"
            @click="close"
          >
            <BaseIcon
              name="close"
              size="1.25em"
            />
          </button>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-5 py-3">
          <slot />
        </div>

        <footer
          v-if="$slots.footer"
          class="flex-none border-t border-line bg-card px-5 py-3"
        >
          <slot name="footer" />
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>
