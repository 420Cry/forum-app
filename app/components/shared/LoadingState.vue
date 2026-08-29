<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg'
    label?: string
    layout?: 'centered' | 'inline'
    padding?: 'none' | 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md',
    layout: 'centered',
    padding: 'md',
  },
)

const sizeClass: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-4 w-4 border',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

const paddingClass: Record<'none' | 'sm' | 'md' | 'lg', string> = {
  none: '',
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-10',
}
</script>

<template>
  <div
    :class="[
      layout === 'inline'
        ? 'flex items-center justify-center gap-2'
        : 'flex flex-col items-center justify-center gap-3',
      paddingClass[padding],
    ]"
    role="status"
    :aria-label="label ?? 'Loading'"
  >
    <div
      class="animate-spin rounded-full border-line border-t-brand shrink-0"
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
