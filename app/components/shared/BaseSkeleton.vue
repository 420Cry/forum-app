<script setup lang="ts">
withDefaults(
  defineProps<{
    rounded?: 'none' | 'sm' | 'md' | 'full'
  }>(),
  {
    rounded: 'md',
  },
)

const roundedClass: Record<'none' | 'sm' | 'md' | 'full', string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  full: 'rounded-full',
}
</script>

<template>
  <div
    class="animate-pulse bg-surface-hover"
    :class="roundedClass[rounded]"
    role="status"
    aria-hidden="true"
  />
</template>
