export type CatalogTagKind = 'goal' | 'location' | 'occupation' | 'industry'

export type CatalogTag = {
  key: string
  name: string
}

export type CatalogTagsResponse = {
  kind: CatalogTagKind
  tags: CatalogTag[]
}
