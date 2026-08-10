import type { CatalogSearchResult } from '~/types/catalogSearch'
import type { CatalogOccupationsResponse } from '~/types/catalogOccupations'
import { useApiConfig } from './useApiConfig'

const PAGE_SIZE = 20

export function useOccupationsApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function searchOccupations(
    q: string,
    offset = 0,
    limit = PAGE_SIZE,
  ): Promise<CatalogSearchResult<CatalogOccupationsResponse['occupations'][number]>> {
    const headers = await getAuthHeaders()
    const res = await $fetch<CatalogOccupationsResponse>(
      `${baseUrl}/catalog/occupations`,
      {
        headers,
        query: { q, offset, limit },
      },
    )
    return {
      rows: res.occupations,
      hasMore: res.hasMore,
      total: res.total,
    }
  }

  return { searchOccupations }
}
