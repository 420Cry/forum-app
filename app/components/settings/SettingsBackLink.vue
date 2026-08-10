<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink
    :to="localePath('/settings')"
    class="inline-flex text-[13px] font-semibold text-ink-3 hover:text-ink no-underline mb-3"
  >
    ← {{ t('common.action.back') }}
  </NuxtLink>
</template>
