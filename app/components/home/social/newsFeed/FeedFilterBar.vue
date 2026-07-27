<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'

const emit = defineEmits<{
  sort: []
}>()

const { t } = useI18n()
</script>

<template>
  <!-- Filter bar: source tabs + sort control -->
  <div
    class="flex items-center justify-between rounded-md border border-line bg-card px-4 py-2.5 shadow-1"
  >
    <div class="flex items-center gap-1">
      <button
        type="button"
        class="rounded-pill bg-brand-tint px-3 py-1.5 text-[12.5px] font-medium text-brand"
      >
        {{ t('feed.action.all_updates') }}
      </button>
      <button
        type="button"
        class="rounded-pill px-3 py-1.5 text-[12.5px] font-medium text-ink-3 hover:bg-surface-hover"
      >
        {{ t('feed.action.following') }}
      </button>
    </div>
    <button
      type="button"
      class="flex items-center gap-1 text-xs text-ink-4 hover:text-ink-3"
      @click="emit('sort')"
    >
      {{ t('feed.action.sort_latest') }}
      <BaseIcon
        name="chevron"
        size="16px"
      />
    </button>
  </div>
</template>
