import type { CatalogSearchResult } from '~/types/catalogSearch'
import type { CatalogOccupationsResponse } from '~/types/catalogOccupations'
import { useApiFetch } from './useApiFetch'

const PAGE_SIZE = 20

export function useOccupationsApi() {
  const { apiFetch } = useApiFetch()
  const { locale } = useI18n()

  async function searchOccupations(
    q: string,
    offset = 0,
    limit = PAGE_SIZE,
  ): Promise<CatalogSearchResult<CatalogOccupationsResponse['occupations'][number]>> {
    const res = await apiFetch<CatalogOccupationsResponse>(
      '/catalog/occupations',
      {
        requireAuth: false,
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
    const res = await apiFetch<{ key: string | null, name: string | null }>(
      '/catalog/occupations/resolve',
      {
        requireAuth: false,
        query: { key, locale: locale.value },
      },
    )
    return res.name
  }

  return { searchOccupations, resolveOccupationName }
}
