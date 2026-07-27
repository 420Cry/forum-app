<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'

const { t } = useI18n()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-md border border-line bg-card px-7 py-9 text-center shadow-1"
  >
    <span
      class="mb-1.5 flex size-14 items-center justify-center rounded-full bg-brand-tint text-brand"
    >
      <BaseIcon
        name="following"
        size="26px"
      />
    </span>
    <p class="text-lg font-bold tracking-[-0.012em] text-ink">
      {{ t('feed.heading.empty') }}
    </p>
    <p class="max-w-[42ch] text-sm leading-[1.55] text-ink-3">
      {{ t('feed.info.empty') }}
    </p>
    <BaseButton class="mt-2">
      {{ t('feed.action.browse_suggestions') }}
    </BaseButton>
  </div>
</template>
