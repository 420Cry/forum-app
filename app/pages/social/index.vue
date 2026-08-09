<script setup lang="ts">
definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
</script>

<template>
  <div class="bg-card border border-line rounded-md shadow-1 px-5 py-10 text-center">
    <p class="text-[15px] font-semibold text-ink">
      {{ t('social.heading.feed') }}
    </p>
    <p class="text-[13px] text-ink-3 mt-2 max-w-md mx-auto">
      {{ t('social.info.feed_soon') }}
    </p>
  </div>
</template>
