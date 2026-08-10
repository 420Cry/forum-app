type Translate = (key: string) => string
type HasKey = (key: string) => boolean

function translateOr(
  te: HasKey,
  t: Translate,
  key: string,
  fallback: string,
): string {
  return te(key) ? t(key) : fallback
}

/** Fixed location seeds (Remote / Other). */
export function locationCatalogLabel(
  key: string,
  fallback: string,
  t: Translate,
  te: HasKey,
): string {
  return translateOr(te, t, `catalog.location.${key}`, fallback)
}

/**
 * @deprecated Occupation translations live in forum-api (`i18n/*.json`).
 * Prefer API `name` / `useOccupationLabels`. Kept as a passthrough for sync call sites.
 */
export function occupationCatalogLabel(
  _key: string,
  fallback: string,
  _t?: Translate,
  _te?: HasKey,
  _locale?: string,
): string {
  return fallback
}

/** Goal chip / fact label from onboard heading keys. */
export function goalCatalogLabel(
  key: string,
  fallback: string,
  t: Translate,
  te: HasKey,
): string {
  return translateOr(te, t, `onboard.heading.goal_${key}`, fallback)
}
