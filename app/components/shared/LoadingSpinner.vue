<script setup lang="ts">
const { size = 'md', label } = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  label?: string
}>()

const sizeClass: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-4 w-4 border',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3"
    role="status"
    :aria-label="label ?? 'Loading'"
  >
    <div
      class="animate-spin rounded-full border-line border-t-brand"
      :class="sizeClass[size]"
    />
    <p
      v-if="label"
      class="text-sm text-ink-3"
    >
      {{ label }}
    </p>
  </div>
</template>
