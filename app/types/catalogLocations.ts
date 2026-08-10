export type CatalogLocation = {
  key: string
  name: string
  placeId: string | null
}

export type CatalogLocationsResponse = {
  locations: CatalogLocation[]
}
