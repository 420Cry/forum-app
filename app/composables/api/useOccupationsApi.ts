import type { CatalogSearchResult } from '~/types/catalogSearch'
import type { CatalogOccupationsResponse } from '~/types/catalogOccupations'
import { useApiConfig } from './useApiConfig'

const PAGE_SIZE = 20

export function useOccupationsApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()
  const { locale } = useI18n()

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
        query: { q, offset, limit, locale: locale.value },
      },
    )
    return {
      rows: res.occupations,
      hasMore: res.hasMore,
      total: res.total,
    }
  }

  async function resolveOccupationName(key: string): Promise<string | null> {
    const headers = await getAuthHeaders()
    const res = await $fetch<{ key: string | null, name: string | null }>(
      `${baseUrl}/catalog/occupations/resolve`,
      {
        headers,
        query: { key, locale: locale.value },
      },
    )
    return res.name
  }

  return { searchOccupations, resolveOccupationName }
}
