export type CatalogSearchResult<T> = {
  rows: T[]
  total: number
  hasMore: boolean
}
