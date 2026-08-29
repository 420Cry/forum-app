<script setup lang="ts">
import FindFilterPill from '~/components/directory/FindFilterPill.vue'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import type { FindChip, FindType } from '~/types/find'
import { FIND_ROLE_QUICK_FILTERS, FIND_TYPE_TAB_FILTERS } from '~/types/find'

defineProps<{
  q: string
  type: FindType
  role: string[]
  loading: boolean
  mode: 'suggestions' | 'results'
  totalCount: number
  facetFilterCount: number
  isSortActive: boolean
  sortLabel: string
  activeChips: FindChip[]
}>()

const emit = defineEmits<{
  'update:q': [value: string]
  'search': []
  'select-type': [value: FindType]
  'toggle-role': [value: string]
  'open-filters': []
  'open-sort': []
  'clear-chip': [clear: () => void]
  'clear-all': []
}>()

const { t } = useI18n()
</script>

<template>
  <section class="overflow-hidden rounded-md border border-line bg-card shadow-1">
    <div class="px-5 pt-4 pb-2.5">
      <h1 class="text-[15px] font-semibold text-ink">
        {{ t('find.heading.directory') }}
      </h1>
      <p class="mt-0.5 text-[12.5px] text-ink-4">
        <template v-if="mode === 'results'">
          <b class="font-semibold text-ink">{{
            t('find.info.results', { count: totalCount })
          }}</b>
          — {{ t('find.info.matching') }}
        </template>
        <template v-else>
          {{ t('find.info.suggestions') }}
        </template>
      </p>
    </div>

    <hr class="h-px border-0 bg-line">

    <div class="flex flex-col gap-3 px-5 py-3.5">
      <div class="flex items-center gap-2">
        <div class="relative min-w-0 flex-1">
          <BaseIcon
            name="search"
            size="1.1em"
            class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-4"
          />
          <BaseInput
            id="find-q"
            :model-value="q"
            class="pl-9"
            :placeholder="t('find.label.query_placeholder')"
            :reserve-error="false"
            @update:model-value="emit('update:q', String($event))"
            @keyup.enter="emit('search')"
          />
        </div>
        <BaseButton
          intent="primary"
          size="sm"
          class="flex-none"
          :disabled="loading"
          @click="emit('search')"
        >
          <span class="inline-flex items-center gap-1.5">
            <span
              v-if="loading"
              class="size-3.5 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white"
              aria-hidden="true"
            />
            {{
              loading
                ? t('find.action.searching')
                : t('find.action.search')
            }}
          </span>
        </BaseButton>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <FindFilterPill
          v-for="filter in FIND_TYPE_TAB_FILTERS"
          :key="filter.value"
          :label="t(filter.labelKey)"
          :active="type === filter.value"
          @click="emit('select-type', filter.value)"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[11px] font-semibold tracking-wide text-ink-4 uppercase">
          {{ t('find.filter.role') }}
        </span>
        <FindFilterPill
          v-for="filter in FIND_ROLE_QUICK_FILTERS"
          :key="filter.value"
          :label="t(filter.labelKey)"
          :active="role.includes(filter.value)"
          @click="emit('toggle-role', filter.value)"
        />
      </div>

      <div class="flex items-center justify-between gap-2">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-pill border px-3.5 py-2 text-[12.5px] font-semibold transition-colors"
          :class="
            facetFilterCount > 0
              ? 'border-brand bg-brand-tint text-brand'
              : 'border-line bg-surface-hover text-ink-2 hover:border-line-2'
          "
          @click="emit('open-filters')"
        >
          <BaseIcon
            name="filters"
            size="1.15em"
          />
          {{ t('find.action.filters') }}
          <span
            v-if="facetFilterCount > 0"
            class="inline-flex min-w-5 items-center justify-center rounded-pill bg-brand px-1.5 py-0.5 text-[11px] leading-none font-bold text-white"
          >
            {{ facetFilterCount }}
          </span>
        </button>

        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-pill border px-3.5 py-2 text-[12.5px] font-semibold transition-colors"
          :class="
            isSortActive
              ? 'border-brand bg-brand-tint text-brand'
              : 'border-line bg-surface-hover text-ink-2 hover:border-line-2'
          "
          @click="emit('open-sort')"
        >
          <BaseIcon
            name="sort"
            size="1.15em"
          />
          <span class="max-w-36 truncate sm:max-w-none">
            {{ t('find.action.sort') }}
            <span class="font-medium text-ink-3">· {{ sortLabel }}</span>
          </span>
        </button>
      </div>

      <div
        v-if="activeChips.length || mode === 'results'"
        class="flex flex-wrap items-center gap-2"
      >
        <button
          v-for="chip in activeChips"
          :key="chip.key"
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-pill border border-line bg-surface-hover px-2.5 py-1 text-[12px] font-semibold text-ink-2 hover:border-line-2"
          @click="emit('clear-chip', chip.clear)"
        >
          {{ chip.label }}
          <span aria-hidden="true">×</span>
        </button>
        <button
          type="button"
          class="cursor-pointer border-0 bg-transparent text-[12.5px] font-semibold text-brand"
          @click="emit('clear-all')"
        >
          {{ t('find.action.clear_all') }}
        </button>
      </div>
    </div>
  </section>
</template>
