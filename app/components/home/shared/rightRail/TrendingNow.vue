<script setup lang="ts">
import BaseEmptyState from '~/components/shared/BaseEmptyState.vue'
import BasePill from '~/components/shared/BasePill.vue'
import { useDiscovery } from '~/composables/discovery/useDiscovery'

const { t } = useI18n()
const { trending } = useDiscovery()
</script>

<template>
  <!-- Trending now -->
  <div class="bg-card border border-line rounded-lg shadow-1">
    <div class="px-4 pt-3.5 pb-1.5">
      <p class="text-[15px] font-semibold text-ink">
        {{ t('social.heading.trending') }}
      </p>
    </div>
    <BaseEmptyState
      v-if="trending.length === 0"
      icon="signal"
      :title="t('social.empty.trending_title')"
      :description="t('social.empty.trending_body')"
    />

    <div v-else>
      <div
        v-for="(item, index) in trending"
        :key="item.id"
        class="grid grid-cols-[18px_1fr_auto] gap-2.5 items-start px-4 py-3 border-t border-line first:border-t-0 hover:bg-surface-hover cursor-pointer"
      >
        <span class="text-xs text-ink-4 font-semibold pt-px">
          {{ String(index + 1).padStart(2, '0') }}
        </span>

        <div class="min-w-0">
          <p class="text-[13.5px] font-semibold text-ink">
            {{ item.title }}
          </p>
          <p class="text-xs text-ink-3 mt-0.5">
            {{ item.subtitle }}
          </p>
        </div>

        <BasePill variant="opportunity">
          {{ t(`social.badge.${item.badge}`) }}
        </BasePill>
      </div>
    </div>
  </div>
</template>
