<script setup lang="ts">
definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
</script>

<template>
  <div class="max-w-170 mx-auto">
    <h1 class="text-[22px] font-bold text-ink tracking-[-0.02em]">
      {{ t('social.heading.feed') }}
    </h1>
    <p class="text-[14px] text-ink-3 mt-2 max-w-[52ch]">
      {{ t('social.info.feed_soon') }}
    </p>
  </div>
</template>
