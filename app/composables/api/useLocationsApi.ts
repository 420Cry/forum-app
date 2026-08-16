import type { CatalogSearchResult } from '~/types/catalogSearch'
import type { CatalogLocationsResponse } from '~/types/catalogLocations'
import { useApiFetch } from './useApiFetch'

const PAGE_SIZE = 20

export function useLocationsApi() {
  const { apiFetch } = useApiFetch()

  async function searchLocations(
    q: string,
    offset = 0,
    limit = PAGE_SIZE,
  ): Promise<CatalogSearchResult<CatalogLocationsResponse['locations'][number]>> {
    const res = await apiFetch<CatalogLocationsResponse>('/catalog/locations', {
      requireAuth: false,
      query: { q, offset, limit },
    })
    return {
      rows: res.locations,
      hasMore: res.hasMore,
      total: res.total,
    }
  }

  return { searchLocations }
}
