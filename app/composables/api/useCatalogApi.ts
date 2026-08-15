import type { CatalogTagKind, CatalogTagsResponse } from '~/types/catalog'
import { useApiFetch } from './useApiFetch'

const cache = new Map<CatalogTagKind, CatalogTagsResponse['tags']>()

export function useCatalogApi() {
  const { apiFetch } = useApiFetch()

  async function fetchTags(kind: CatalogTagKind, force = false) {
    if (!force && cache.has(kind)) {
      return cache.get(kind)!
    }
    const res = await apiFetch<CatalogTagsResponse>('/catalog/tags', {
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
