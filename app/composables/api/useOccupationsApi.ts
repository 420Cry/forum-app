import type { CatalogOccupationsResponse } from '~/types/catalogOccupations'
import { useApiConfig } from './useApiConfig'

export function useOccupationsApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function searchOccupations(q: string) {
    const headers = await getAuthHeaders()
    const res = await $fetch<CatalogOccupationsResponse>(
      `${baseUrl}/catalog/occupations`,
      {
        headers,
        query: { q },
      },
    )
    return res.occupations
  }

  return { searchOccupations }
}
