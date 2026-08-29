import { useProfilesApi } from '~/composables/api/useProfilesApi'
import { buildFindQuery, EMPTY_FIND_RESULTS } from '~/composables/find/findDirectoryQuery'
import { useFindDirectoryCatalog } from '~/composables/find/useFindDirectoryCatalog'
import { useFindDirectoryDerived } from '~/composables/find/useFindDirectoryDerived'
import { useFindFacetState } from '~/composables/find/useFindFacetState'
import type { FindMode, FindOption, FindSort, FindType } from '~/types/find'
import type { FindResults } from '~/types/profile'

export function useFindDirectory() {
  const { t } = useI18n()
  const { find } = useProfilesApi()

  const q = ref('')
  const type = ref<FindType>('all')
  const sort = ref<FindSort>('newest')
  const loading = ref(false)
  const mode = ref<FindMode>('suggestions')
  const results = ref<FindResults>(EMPTY_FIND_RESULTS())
  const filtersOpen = ref(false)
  const sortOpen = ref(false)

  const facets = useFindFacetState(type)
  const catalog = useFindDirectoryCatalog()

  const roleOptions = computed<FindOption[]>(() => [
    { value: 'Founder', label: t('find.filter.role_founder') },
    { value: 'Investor', label: t('find.filter.role_investor') },
  ])

  const derived = useFindDirectoryDerived({
    results,
    sort,
    type,
    facetFilterCount: facets.facetFilterCount,
    facets: {
      location: facets.location,
      occupation: facets.occupation,
      role: facets.role,
      industry: facets.industry,
      stage: facets.stage,
    },
    visibility: {
      showPeopleFilters: facets.showPeopleFilters,
      showOrgFilters: facets.showOrgFilters,
      showStageFilter: facets.showStageFilter,
    },
    locationOptions: catalog.locationOptions,
    occupationOptions: catalog.occupationOptions,
    industryOptions: catalog.industryOptions,
    roleOptions,
    occupationLabel: catalog.occupationLabel,
    q,
    removeFacetValue: facets.removeFacetValue,
  })

  function syncFacetDraftsBeforeSearch() {
    if (filtersOpen.value || facets.hasPendingFacetDraft()) {
      facets.commitDraftFilters()
      filtersOpen.value = false
    }
  }

  async function loadDirectory(nextMode: FindMode) {
    loading.value = true
    try {
      results.value = await find(
        buildFindQuery(nextMode, {
          q: q.value,
          type: type.value,
          sort: sort.value,
          facets: facets.facetValues.value,
          visibility: facets.visibility.value,
        }),
      )
      mode.value = nextMode
    }
    catch {
      results.value = EMPTY_FIND_RESULTS()
      mode.value = nextMode
    }
    finally {
      loading.value = false
    }
  }

  async function runSearch() {
    syncFacetDraftsBeforeSearch()
    if (!derived.hasActiveFilters.value && !q.value.trim()) {
      await loadDirectory('suggestions')
      return
    }
    await loadDirectory('results')
  }

  async function onSearch() {
    await runSearch()
  }

  function selectType(next: FindType) {
    type.value = next
    void onSearch()
  }

  function toggleRole(value: string) {
    const current = facets.role.value
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    facets.syncRoleDraft(next)
    if (type.value === 'startup' || type.value === 'investor') {
      type.value = 'all'
    }
    void onSearch()
  }

  function openFilters() {
    facets.openFiltersDrawer()
    filtersOpen.value = true
  }

  async function applyFilters() {
    await runSearch()
  }

  async function clearDraftFilters() {
    facets.clearFacetState()
    await onSearch()
  }

  async function clearFilters() {
    q.value = ''
    type.value = 'all'
    sort.value = 'newest'
    facets.clearFacetState()
    await loadDirectory('suggestions')
  }

  async function clearChip(clear: () => void) {
    clear()
    await onSearch()
  }

  watch(filtersOpen, (open) => {
    if (!open) facets.resetDraftFilters()
  })

  onMounted(async () => {
    if (type.value === 'startup' || type.value === 'investor') {
      type.value = 'all'
    }
    await catalog.loadCatalogOptions()
    void loadDirectory('suggestions')
  })

  return {
    q,
    type,
    industry: facets.industry,
    location: facets.location,
    occupation: facets.occupation,
    role: facets.role,
    stage: facets.stage,
    sort,
    loading,
    mode,
    filtersOpen,
    sortOpen,
    draftLocation: facets.draftLocation,
    draftOccupation: facets.draftOccupation,
    draftRole: facets.draftRole,
    draftIndustry: facets.draftIndustry,
    draftStage: facets.draftStage,
    locationOptions: catalog.locationOptions,
    occupationOptions: catalog.occupationOptions,
    industryOptions: catalog.industryOptions,
    roleOptions,
    showPeopleFilters: facets.showPeopleFilters,
    showOrgFilters: facets.showOrgFilters,
    showStageFilter: facets.showStageFilter,
    facetFilterCount: facets.facetFilterCount,
    isSortActive: derived.isSortActive,
    activeChips: derived.activeChips,
    sortLabel: derived.sortLabel,
    totalCount: derived.totalCount,
    flatResults: derived.flatResults,
    onSearch,
    selectType,
    toggleRole,
    openFilters,
    applyFilters,
    clearDraftFilters,
    clearFilters,
    clearChip,
    onSortSelect: onSearch,
  }
}
