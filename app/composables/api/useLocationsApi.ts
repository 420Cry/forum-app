import type { CatalogSearchResult } from '~/types/catalogSearch'
import type { CatalogLocationsResponse } from '~/types/catalogLocations'
import { useApiConfig } from './useApiConfig'

const PAGE_SIZE = 20

export function useLocationsApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function searchLocations(
    q: string,
    offset = 0,
    limit = PAGE_SIZE,
  ): Promise<CatalogSearchResult<CatalogLocationsResponse['locations'][number]>> {
    const headers = await getAuthHeaders()
    const res = await $fetch<CatalogLocationsResponse>(
      `${baseUrl}/catalog/locations`,
      {
        headers,
        query: { q, offset, limit },
      },
    )
    return {
      rows: res.locations,
      hasMore: res.hasMore,
      total: res.total,
    }
  }

  return { searchLocations }
}
