<script setup lang="ts">
defineProps<{
  label: string
  active?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    class="inline-flex cursor-pointer items-center gap-1.5 rounded-pill border-[1.4px] px-3.5 py-1.75 text-[12.5px] font-semibold whitespace-nowrap transition-colors"
    :class="
      active
        ? 'border-brand bg-brand-tint text-brand'
        : 'border-line bg-card text-ink-2 hover:border-line-2 hover:bg-surface-hover'
    "
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>
