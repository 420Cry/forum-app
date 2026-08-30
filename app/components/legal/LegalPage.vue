<script setup lang="ts">
const { title, intro } = defineProps<{
  title: string
  intro?: string
}>()

const { t } = useI18n()

useHead({
  title: () => t(title),
})
</script>

<template>
  <article class="mx-auto max-w-prose pb-8">
    <h1 class="text-[22px] font-bold tracking-[-0.02em] text-ink">
      {{ t(title) }}
    </h1>
    <p
      v-if="intro"
      class="mt-3 text-base text-ink-2"
    >
      {{ t(intro) }}
    </p>
    <slot />
  </article>
</template>
