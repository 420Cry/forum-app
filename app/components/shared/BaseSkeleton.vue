<script setup lang="ts">
withDefaults(
  defineProps<{
    rounded?: 'sm' | 'md' | 'full'
  }>(),
  {
    rounded: 'md',
  },
)

const roundedClass: Record<'sm' | 'md' | 'full', string> = {
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
