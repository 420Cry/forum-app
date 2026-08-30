<script setup lang="ts">
withDefaults(
  defineProps<{
    on: boolean
    label: string
    disabled?: boolean
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    type="button"
    role="switch"
    class="relative mt-0.5 h-6 w-10 flex-none rounded-pill transition-colors duration-150"
    :class="
      disabled
        ? 'bg-brand opacity-60'
        : on
          ? 'cursor-pointer bg-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
          : 'cursor-pointer bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'
    "
    :aria-checked="on"
    :aria-label="label"
    :disabled="disabled"
    @click="emit('toggle')"
  >
    <span
      class="absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-1 transition-transform duration-150"
      :class="on ? 'translate-x-4' : 'translate-x-0'"
    />
  </button>
</template>
