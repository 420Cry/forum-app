<script setup lang="ts">
const { heading, info } = defineProps<{
  heading: string
  info?: string
}>()

const { t } = useI18n()
</script>

<template>
  <section class="mt-8">
    <h2 class="text-[16px] font-semibold text-ink">
      {{ t(heading) }}
    </h2>
    <p
      v-if="info"
      class="mt-2 text-base text-ink-2"
    >
      {{ t(info) }}
    </p>
    <slot />
  </section>
</template>
