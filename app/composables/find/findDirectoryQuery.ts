import type { FindMode, FindSort, FindType } from '~/types/find'
import { joinCsv } from '~/types/find'
import type { FindResults } from '~/types/profile'

export const EMPTY_FIND_RESULTS = (): FindResults => ({
  users: [],
  startups: [],
  investors: [],
})

export type FindFacetVisibility = {
  showPeopleFilters: boolean
  showOrgFilters: boolean
  showStageFilter: boolean
}

export type FindFacetValues = {
  industry: string[]
  location: string[]
  occupation: string[]
  role: string[]
  stage: string[]
}

export function resolveApiType(
  type: FindType,
  isSuggestions: boolean,
  visibility: FindFacetVisibility,
  facets: Pick<FindFacetValues, 'location' | 'occupation' | 'role'>,
): FindType | undefined {
  if (isSuggestions || type !== 'all') {
    return type === 'all' ? undefined : type
  }
  const hasPeopleFacets
    = visibility.showPeopleFilters
      && (facets.location.length > 0
        || facets.occupation.length > 0
        || facets.role.length > 0)
  if (hasPeopleFacets) return 'user'
  return undefined
}

export function buildFindQuery(
  mode: FindMode,
  input: {
    q: string
    type: FindType
    sort: FindSort
    facets: FindFacetValues
    visibility: FindFacetVisibility
  },
) {
  const isSuggestions = mode === 'suggestions'
  const { q, type, sort, facets, visibility } = input

  return {
    q: isSuggestions ? undefined : (q.trim() || undefined),
    type: resolveApiType(type, isSuggestions, visibility, facets),
    industry: isSuggestions || !visibility.showOrgFilters
      ? undefined
      : joinCsv(facets.industry),
    location: isSuggestions || !visibility.showPeopleFilters
      ? undefined
      : joinCsv(facets.location),
    occupation: isSuggestions || !visibility.showPeopleFilters
      ? undefined
      : joinCsv(facets.occupation),
    role: isSuggestions || !visibility.showPeopleFilters
      ? undefined
      : joinCsv(facets.role),
    stage: isSuggestions || !visibility.showStageFilter
      ? undefined
      : joinCsv(facets.stage),
    sort: sort === 'newest' ? undefined : sort,
    limit: isSuggestions ? '12' : undefined,
  }
}
