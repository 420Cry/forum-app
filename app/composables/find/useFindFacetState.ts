import type { FindType } from '~/types/find'
import { removeValue } from '~/types/find'

const FACET_KEYS = [
  'location',
  'occupation',
  'role',
  'industry',
  'stage',
] as const

type FacetKey = (typeof FACET_KEYS)[number]

export type FindFacetKey = FacetKey

function arraysEqual(a: string[], b: string[]) {
  return JSON.stringify(a) === JSON.stringify(b)
}

export function useFindFacetState(type: Ref<FindType>) {
  const location = ref<string[]>([])
  const occupation = ref<string[]>([])
  const role = ref<string[]>([])
  const industry = ref<string[]>([])
  const stage = ref<string[]>([])

  const draftLocation = ref<string[]>([])
  const draftOccupation = ref<string[]>([])
  const draftRole = ref<string[]>([])
  const draftIndustry = ref<string[]>([])
  const draftStage = ref<string[]>([])

  const committed = {
    location,
    occupation,
    role,
    industry,
    stage,
  } as const satisfies Record<FacetKey, Ref<string[]>>

  const draft = {
    location: draftLocation,
    occupation: draftOccupation,
    role: draftRole,
    industry: draftIndustry,
    stage: draftStage,
  } as const satisfies Record<FacetKey, Ref<string[]>>

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

  const visibility = computed(() => ({
    showPeopleFilters: showPeopleFilters.value,
    showOrgFilters: showOrgFilters.value,
    showStageFilter: showStageFilter.value,
  }))

  const facetValues = computed(() => ({
    location: location.value,
    occupation: occupation.value,
    role: role.value,
    industry: industry.value,
    stage: stage.value,
  }))

  const facetFilterCount = computed(() => {
    let count = 0
    if (showPeopleFilters.value) {
      count += location.value.length + occupation.value.length + role.value.length
    }
    if (showOrgFilters.value) count += industry.value.length
    if (showStageFilter.value) count += stage.value.length
    return count
  })

  function hasPendingFacetDraft() {
    return FACET_KEYS.some(key =>
      !arraysEqual(draft[key].value, committed[key].value),
    )
  }

  function alignTypeForCommittedFacets() {
    const hasPeople
      = role.value.length > 0
        || location.value.length > 0
        || occupation.value.length > 0
    if (hasPeople && (type.value === 'startup' || type.value === 'investor')) {
      type.value = 'user'
    }
  }

  function resetDraftFilters() {
    for (const key of FACET_KEYS) {
      draft[key].value = [...committed[key].value]
    }
  }

  function commitDraftFilters() {
    for (const key of FACET_KEYS) {
      committed[key].value = [...draft[key].value]
    }
    alignTypeForCommittedFacets()
  }

  function clearFacetState() {
    for (const key of FACET_KEYS) {
      committed[key].value = []
      draft[key].value = []
    }
  }

  function syncRoleDraft(roleValues: string[]) {
    role.value = roleValues
    draftRole.value = [...roleValues]
  }

  function removeFacetValue(key: FacetKey, value: string) {
    committed[key].value = removeValue(committed[key].value, value)
    draft[key].value = [...committed[key].value]
  }

  function openFiltersDrawer() {
    resetDraftFilters()
  }

  return {
    location,
    occupation,
    role,
    industry,
    stage,
    draftLocation,
    draftOccupation,
    draftRole,
    draftIndustry,
    draftStage,
    showPeopleFilters,
    showOrgFilters,
    showStageFilter,
    visibility,
    facetValues,
    facetFilterCount,
    hasPendingFacetDraft,
    resetDraftFilters,
    commitDraftFilters,
    clearFacetState,
    syncRoleDraft,
    removeFacetValue,
    openFiltersDrawer,
  }
}
