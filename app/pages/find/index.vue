<script setup lang="ts">
import FindFiltersDrawer from '~/components/directory/FindFiltersDrawer.vue'
import FindSearchPanel from '~/components/directory/FindSearchPanel.vue'
import FindSortDrawer from '~/components/directory/FindSortDrawer.vue'
import ResultCard from '~/components/directory/ResultCard.vue'
import { useFindDirectory } from '~/composables/find/useFindDirectory'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()

const {
  q,
  type,
  sort,
  loading,
  mode,
  filtersOpen,
  sortOpen,
  draftLocation,
  draftOccupation,
  draftRole,
  draftIndustry,
  draftStage,
  locationOptions,
  occupationOptions,
  industryOptions,
  roleOptions,
  showPeopleFilters,
  showOrgFilters,
  showStageFilter,
  facetFilterCount,
  isSortActive,
  activeChips,
  sortLabel,
  totalCount,
  flatResults,
  onSearch,
  selectType,
  openFilters,
  applyFilters,
  clearDraftFilters,
  clearFilters,
  clearChip,
  onSortSelect,
} = useFindDirectory()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-3">
    <FindSearchPanel
      :q="q"
      :type="type"
      :loading="loading"
      :mode="mode"
      :total-count="totalCount"
      :facet-filter-count="facetFilterCount"
      :is-sort-active="isSortActive"
      :sort-label="sortLabel"
      :active-chips="activeChips"
      @update:q="q = $event"
      @search="onSearch"
      @select-type="selectType"
      @open-filters="openFilters"
      @open-sort="sortOpen = true"
      @clear-chip="clearChip"
      @clear-all="clearFilters"
    />

    <div
      v-if="loading && flatResults.length === 0"
      class="rounded-md border border-line bg-card px-5 py-10 text-center text-sm text-ink-3 shadow-1"
    >
      {{ t('common.info.loading') }}
    </div>

    <div
      v-else-if="!loading && flatResults.length === 0"
      class="rounded-md border border-line bg-card px-5 py-10 text-center text-sm text-ink-3 shadow-1"
    >
      {{
        mode === 'suggestions'
          ? t('find.info.suggestions_empty')
          : t('find.info.empty')
      }}
    </div>

    <ResultCard
      v-for="row in flatResults"
      :key="row.key"
      :name="row.name"
      :href="row.href"
      :target-type="row.targetType"
      :target-id="row.targetId"
      :industry="row.industry"
      :description="row.description"
      :meta="row.meta"
      :pill-variant="row.pillVariant"
      :pill-label="row.pillLabel"
      :avatar-url="row.avatarUrl"
    />

    <FindFiltersDrawer
      v-model:open="filtersOpen"
      v-model:location="draftLocation"
      v-model:occupation="draftOccupation"
      v-model:role="draftRole"
      v-model:industry="draftIndustry"
      v-model:stage="draftStage"
      :location-options="locationOptions"
      :occupation-options="occupationOptions"
      :industry-options="industryOptions"
      :role-options="roleOptions"
      :show-people-filters="showPeopleFilters"
      :show-org-filters="showOrgFilters"
      :show-stage-filter="showStageFilter"
      @apply="applyFilters"
      @clear="clearDraftFilters"
    />

    <FindSortDrawer
      v-model:open="sortOpen"
      v-model="sort"
      @select="onSortSelect"
    />
  </div>
</template>
