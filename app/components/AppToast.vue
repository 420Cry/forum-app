<script setup lang="ts">
import type { ToastType } from '~/composables/useToast'

const { toasts, remove } = useToast()
const { t } = useI18n()

const typeStyles: Record<ToastType, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error: 'border-red-200 bg-red-50 text-red-800',
  info: 'border-slate-200 bg-slate-50 text-slate-800',
}
</script>

<template>
  <div
    class="pointer-events-none fixed right-4 top-4 z-100 flex flex-col gap-2"
    aria-live="polite"
  >
    <TransitionGroup
      enter-from-class="opacity-0 translate-x-4"
      enter-active-class="transition-all duration-200 ease-out"
      enter-to-class="opacity-100 translate-x-0"
      leave-from-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 translate-x-4"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto relative min-w-[280px] max-w-md rounded-lg border px-4 py-3 pr-8 shadow-lg"
        :class="typeStyles[toast.type]"
        role="alert"
      >
        <p class="text-sm font-medium">
          {{ toast.message }}
        </p>
        <button
          type="button"
          class="absolute right-2 top-2 rounded p-1 opacity-70 hover:opacity-100"
          :aria-label="t('common.aria.dismiss')"
          @click="remove(toast.id)"
        >
          <span class="sr-only">{{ t('common.action.dismiss') }}</span>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
