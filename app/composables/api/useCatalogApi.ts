import type { CatalogTagKind, CatalogTagsResponse } from '~/types/catalog'
import { useApiConfig } from './useApiConfig'

const cache = new Map<CatalogTagKind, CatalogTagsResponse['tags']>()

export function useCatalogApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig()

  async function fetchTags(kind: CatalogTagKind, force = false) {
    if (!force && cache.has(kind)) {
      return cache.get(kind)!
    }
    const headers = await getAuthHeaders()
    const res = await $fetch<CatalogTagsResponse>(`${baseUrl}/catalog/tags`, {
      headers,
      query: { kind },
    })
    cache.set(kind, res.tags)
    return res.tags
  }

  function clearCatalogCache() {
    cache.clear()
  }

  return { fetchTags, clearCatalogCache }
}
