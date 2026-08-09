<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div
    class="w-full bg-card py-3.5 px-4 border border-line rounded-lg shadow-1 flex flex-col gap-1"
  >
    <p class="font-semibold text-[13px] text-ink">
      {{ t('social.heading.become_member') }}
    </p>
    <p class="text-[12.5px]/relaxed text-ink-3">
      {{ t('social.info.become_member') }}
    </p>
    <p class="mt-1 text-[12.5px] text-brand font-semibold">
      {{ t('social.action.learn_more') }} →
    </p>
  </div>
</template>
