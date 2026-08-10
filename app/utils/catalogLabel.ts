/** Role suffixes used by the industry×role occupation matrix. */
const OCCUPATION_ROLES = [
  'product_manager',
  'sales_lead',
  'analyst',
  'architect',
  'consultant',
  'designer',
  'director',
  'engineer',
  'lead',
  'manager',
  'marketer',
  'operator',
  'researcher',
  'scientist',
  'specialist',
] as const

const OCCUPATION_SENIORITIES = [
  'associate',
  'junior',
  'lead',
  'principal',
  'senior',
] as const

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
 * Occupation display label: exact i18n key → composed domain/role → fallback.
 * Matrix titles like `ai_engineer` compose from `catalog.occupation_domain.*`
 * + `catalog.occupation_role.*` when locale translations exist.
 */
export function occupationCatalogLabel(
  key: string,
  fallback: string,
  t: Translate,
  te: HasKey,
): string {
  const exact = `catalog.occupation.${key}`
  if (te(exact)) return t(exact)

  for (const seniority of OCCUPATION_SENIORITIES) {
    const prefix = `${seniority}_`
    if (!key.startsWith(prefix)) continue
    const rest = key.slice(prefix.length)
    const restLabel = occupationCatalogLabel(rest, '', t, te)
    if (!restLabel) break
    const seniorityKey = `catalog.occupation_seniority.${seniority}`
    if (!te(seniorityKey)) break
    return `${t(seniorityKey)} ${restLabel}`
  }

  for (const role of OCCUPATION_ROLES) {
    const suffix = `_${role}`
    if (!key.endsWith(suffix)) continue
    const domain = key.slice(0, -suffix.length)
    const domainKey = `catalog.occupation_domain.${domain}`
    const roleKey = `catalog.occupation_role.${role}`
    if (!te(domainKey) || !te(roleKey)) break
    // English-like order: "AI Engineer"; Vietnamese copy can still read naturally.
    return `${t(domainKey)} ${t(roleKey)}`
  }

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
