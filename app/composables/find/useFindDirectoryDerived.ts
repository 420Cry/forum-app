import type { FindChip, FindOption, FindSort } from '~/types/find'
import type { FindResults } from '~/types/profile'
import { facetChips, optionLabel } from '~/utils/findChips'
import { flattenFindResults } from '~/utils/findResults'

type FacetRefs = {
  location: Ref<string[]>
  occupation: Ref<string[]>
  role: Ref<string[]>
  industry: Ref<string[]>
  stage: Ref<string[]>
}

type FacetVisibility = {
  showPeopleFilters: Ref<boolean>
  showOrgFilters: Ref<boolean>
  showStageFilter: Ref<boolean>
}

export function useFindDirectoryDerived(input: {
  results: Ref<FindResults>
  sort: Ref<FindSort>
  type: Ref<string>
  facetFilterCount: Ref<number>
  facets: FacetRefs
  visibility: FacetVisibility
  locationOptions: Ref<FindOption[]>
  occupationOptions: Ref<FindOption[]>
  industryOptions: Ref<FindOption[]>
  roleOptions: Ref<FindOption[]>
  occupationLabel: (key: string, fallback: string) => string
  q: Ref<string>
}) {
  const { t, te, locale } = useI18n()

  const isSortActive = computed(() => input.sort.value !== 'newest')

  const hasActiveFilters = computed(
    () =>
      !!input.q.value.trim()
      || input.facetFilterCount.value > 0
      || input.type.value !== 'all'
      || isSortActive.value,
  )

  const activeChips = computed<FindChip[]>(() => [
    ...facetChips(
      'location',
      input.facets.location,
      v => optionLabel(input.locationOptions.value, v),
      input.visibility.showPeopleFilters.value,
    ),
    ...facetChips(
      'occupation',
      input.facets.occupation,
      v => optionLabel(input.occupationOptions.value, v),
      input.visibility.showPeopleFilters.value,
    ),
    ...facetChips(
      'role',
      input.facets.role,
      v => optionLabel(input.roleOptions.value, v),
      input.visibility.showPeopleFilters.value,
    ),
    ...facetChips(
      'industry',
      input.facets.industry,
      v => optionLabel(input.industryOptions.value, v),
      input.visibility.showOrgFilters.value,
    ),
    ...facetChips(
      'stage',
      input.facets.stage,
      v => t(`profiles.stage.${v}`),
      input.visibility.showStageFilter.value,
    ),
  ])

  const sortLabel = computed(() =>
    input.sort.value === 'name' ? t('find.sort.name') : t('find.sort.newest'),
  )

  const totalCount = computed(
    () =>
      input.results.value.users.length
      + input.results.value.startups.length
      + input.results.value.investors.length,
  )

  const flatResults = computed(() =>
    flattenFindResults(
      input.results.value,
      (key, params) => (params ? t(key, params as never) : t(key)),
      te,
      locale.value,
      input.occupationLabel,
    ),
  )

  return {
    isSortActive,
    hasActiveFilters,
    activeChips,
    sortLabel,
    totalCount,
    flatResults,
  }
}
