import type { CatalogLocationsResponse } from '~/types/catalogLocations'
import { useApiConfig } from './useApiConfig'

export function useLocationsApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function searchLocations(q: string) {
    const headers = await getAuthHeaders()
    const res = await $fetch<CatalogLocationsResponse>(
      `${baseUrl}/catalog/locations`,
      {
        headers,
        query: { q },
      },
    )
    return res.locations
  }

  return { searchLocations }
}
