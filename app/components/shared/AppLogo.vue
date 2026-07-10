<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <NuxtLink
    :to="localePath('/')"
    class="inline-flex shrink-0 items-center"
    :aria-label="t('common.heading.forum')"
  >
    <span class="font-wordmark text-[22px] font-semibold leading-none tracking-[-0.005em] text-ink">
      fund<span class="text-accent">e</span>dr
    </span>
  </NuxtLink>
</template>
