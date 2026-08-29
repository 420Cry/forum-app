<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="mb-6">
    <h2 class="text-[27px] leading-[1.15] font-bold tracking-[-0.02em] text-ink">
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="mt-2 text-[14.5px] leading-relaxed text-ink-3 text-pretty"
    >
      <slot name="subtitle">
        {{ subtitle }}
      </slot>
    </p>
  </header>
</template>
