import { useCatalogApi } from '~/composables/api/useCatalogApi'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import type {
  FindChip,
  FindMode,
  FindOption,
  FindSort,
  FindType,
} from '~/types/find'
import { FIND_TYPE_FILTERS, joinCsv } from '~/types/find'
import type { FindResults } from '~/types/profile'
import { facetChips, optionLabel } from '~/utils/findChips'
import { flattenFindResults } from '~/utils/findResults'
import { locationCatalogLabel } from '~/utils/catalogLabel'
import { useOccupationLabels } from '~/composables/catalog/useOccupationLabels'

const emptyResults = (): FindResults => ({
  users: [],
  startups: [],
  investors: [],
})

export function useFindDirectory() {
  const { t, te, locale } = useI18n()
  const { find } = useProfilesApi()
  const { fetchTags } = useCatalogApi()
  const { ensureLoaded, label: occupationLabel } = useOccupationLabels()

  const q = ref('')
  const type = ref<FindType>('all')
  const industry = ref<string[]>([])
  const location = ref<string[]>([])
  const occupation = ref<string[]>([])
  const role = ref<string[]>([])
  const stage = ref<string[]>([])
  const sort = ref<FindSort>('newest')

  const loading = ref(false)
  const mode = ref<FindMode>('suggestions')
  const results = ref<FindResults>(emptyResults())

  const filtersOpen = ref(false)
  const sortOpen = ref(false)
  const draftLocation = ref<string[]>([])
  const draftOccupation = ref<string[]>([])
  const draftRole = ref<string[]>([])
  const draftIndustry = ref<string[]>([])
  const draftStage = ref<string[]>([])

  const locationOptions = ref<FindOption[]>([])
  const occupationOptions = ref<FindOption[]>([])
  const industryOptions = ref<FindOption[]>([])

  const roleOptions = computed<FindOption[]>(() => [
    { value: 'Founder', label: t('find.filter.role_founder') },
    { value: 'Investor', label: t('find.filter.role_investor') },
  ])

  const showPeopleFilters = computed(
    () => type.value === 'all' || type.value === 'user',
  )
  const showOrgFilters = computed(
    () =>
      type.value === 'all'
      || type.value === 'startup'
      || type.value === 'investor',
  )
  const showStageFilter = computed(
    () => type.value === 'all' || type.value === 'startup',
  )

  const facetFilterCount = computed(() => {
    let count = 0
    if (showPeopleFilters.value) {
      count += location.value.length + occupation.value.length + role.value.length
    }
    if (showOrgFilters.value) count += industry.value.length
    if (showStageFilter.value) count += stage.value.length
    return count
  })

  const isSortActive = computed(() => sort.value !== 'newest')

  const hasActiveFilters = computed(
    () =>
      !!q.value.trim()
      || facetFilterCount.value > 0
      || type.value !== 'all'
      || isSortActive.value,
  )

  const activeChips = computed<FindChip[]>(() => [
    ...facetChips(
      'location',
      location,
      v => optionLabel(locationOptions.value, v),
      showPeopleFilters.value,
    ),
    ...facetChips(
      'occupation',
      occupation,
      v => optionLabel(occupationOptions.value, v),
      showPeopleFilters.value,
    ),
    ...facetChips(
      'role',
      role,
      v => optionLabel(roleOptions.value, v),
      showPeopleFilters.value,
    ),
    ...facetChips(
      'industry',
      industry,
      v => optionLabel(industryOptions.value, v),
      showOrgFilters.value,
    ),
    ...facetChips(
      'stage',
      stage,
      v => t(`profiles.stage.${v}`),
      showStageFilter.value,
    ),
  ])

  const sortLabel = computed(() =>
    sort.value === 'name' ? t('find.sort.name') : t('find.sort.newest'),
  )

  const totalCount = computed(
    () =>
      results.value.users.length
      + results.value.startups.length
      + results.value.investors.length,
  )

  const flatResults = computed(() =>
    flattenFindResults(
      results.value,
      (key, params) => (params ? t(key, params as never) : t(key)),
      te,
      locale.value,
      occupationLabel,
    ),
  )

  async function loadDirectory(nextMode: FindMode) {
    loading.value = true
    try {
      const isSuggestions = nextMode === 'suggestions'
      results.value = await find({
        q: isSuggestions ? undefined : (q.value.trim() || undefined),
        type: type.value === 'all' ? undefined : type.value,
        industry: isSuggestions || !showOrgFilters.value
          ? undefined
          : joinCsv(industry.value),
        location: isSuggestions || !showPeopleFilters.value
          ? undefined
          : joinCsv(location.value),
        occupation: isSuggestions || !showPeopleFilters.value
          ? undefined
          : joinCsv(occupation.value),
        role: isSuggestions || !showPeopleFilters.value
          ? undefined
          : joinCsv(role.value),
        stage: isSuggestions || !showStageFilter.value
          ? undefined
          : joinCsv(stage.value),
        sort: sort.value === 'newest' ? undefined : sort.value,
        limit: isSuggestions ? '12' : undefined,
      })
      mode.value = nextMode
    }
    catch {
      results.value = emptyResults()
      mode.value = nextMode
    }
    finally {
      loading.value = false
    }
  }

  async function onSearch() {
    if (!hasActiveFilters.value && !q.value.trim()) {
      await loadDirectory('suggestions')
      return
    }
    await loadDirectory('results')
  }

  function selectType(next: FindType) {
    type.value = next
    void onSearch()
  }

  function openFilters() {
    draftLocation.value = [...location.value]
    draftOccupation.value = [...occupation.value]
    draftRole.value = [...role.value]
    draftIndustry.value = [...industry.value]
    draftStage.value = [...stage.value]
    filtersOpen.value = true
  }

  async function applyFilters() {
    location.value = [...draftLocation.value]
    occupation.value = [...draftOccupation.value]
    role.value = [...draftRole.value]
    industry.value = [...draftIndustry.value]
    stage.value = [...draftStage.value]
    await onSearch()
  }

  function clearFacetState() {
    location.value = []
    occupation.value = []
    role.value = []
    industry.value = []
    stage.value = []
    draftLocation.value = []
    draftOccupation.value = []
    draftRole.value = []
    draftIndustry.value = []
    draftStage.value = []
  }

  async function clearDraftFilters() {
    clearFacetState()
    await onSearch()
  }

  async function clearFilters() {
    q.value = ''
    type.value = 'all'
    sort.value = 'newest'
    clearFacetState()
    await loadDirectory('suggestions')
  }

  async function clearChip(clear: () => void) {
    clear()
    await onSearch()
  }

  async function loadCatalogOptions() {
    const [locations, occupations, industries] = await Promise.all([
      fetchTags('location').catch(() => []),
      fetchTags('occupation').catch(() => []),
      fetchTags('industry').catch(() => []),
      ensureLoaded().catch(() => undefined),
    ])
    locationOptions.value = locations.map(tag => ({
      value: tag.key,
      label: locationCatalogLabel(tag.key, tag.name, t, te),
    }))
    occupationOptions.value = occupations.map(tag => ({
      value: tag.key,
      label: occupationLabel(tag.key, tag.name),
    }))
    industryOptions.value = industries.map(tag => ({
      value: tag.key,
      label: tag.name,
    }))
  }

  watch(locale, async () => {
    await ensureLoaded().catch(() => undefined)
    occupationOptions.value = occupationOptions.value.map(opt => ({
      value: opt.value,
      label: occupationLabel(opt.value, opt.label),
    }))
    locationOptions.value = locationOptions.value.map(opt => ({
      value: opt.value,
      label: locationCatalogLabel(opt.value, opt.label, t, te),
    }))
  })

  onMounted(async () => {
    await loadCatalogOptions()
    void loadDirectory('suggestions')
  })

  return {
    q,
    type,
    industry,
    location,
    occupation,
    role,
    stage,
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
    typeFilters: FIND_TYPE_FILTERS,
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
    onSortSelect: onSearch,
  }
}
