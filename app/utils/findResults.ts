import type { FindResults } from '~/types/profile'
import type { FindResultRow } from '~/types/find'
import { locationCatalogLabel } from '~/utils/catalogLabel'
import { stageToPillVariant } from '~/utils/stagePill'

type Translate = (key: string, params?: Record<string, unknown>) => string
type HasKey = (key: string) => boolean
type OccupationLabel = (key: string, fallback: string) => string

export function flattenFindResults(
  results: FindResults,
  t: Translate,
  te: HasKey = () => false,
  _locale = 'en',
  occupationLabel: OccupationLabel = (_key, fallback) => fallback,
): FindResultRow[] {
  const rows: FindResultRow[] = []

  for (const user of results.users) {
    const occupation = user.occupation
      ? occupationLabel(user.occupationKey ?? '', user.occupation)
      : null
    const location = user.location
      ? locationCatalogLabel(user.locationKey ?? '', user.location, t, te)
      : null
    rows.push({
      key: `user-${user.id}`,
      name: user.name || t('profiles.info.unnamed'),
      href: user.profilePath,
      targetType: 'user',
      targetId: user.id,
      industry: occupation,
      description: null,
      meta: [user.role, location].filter(Boolean) as string[],
      pillVariant: undefined,
      pillLabel: user.role ?? undefined,
      avatarUrl: user.avatarUrl,
    })
  }

  for (const startup of results.startups) {
    rows.push({
      key: `startup-${startup.id}`,
      name: startup.companyName,
      href: startup.href,
      targetType: 'startup',
      targetId: startup.id,
      industry: startup.industry,
      description: startup.description,
      meta: [
        t('profiles.info.stats', {
          views: startup.views,
          connections: startup.connections,
        }),
      ],
      pillVariant: stageToPillVariant(startup.stage),
      pillLabel: t(`profiles.stage.${startup.stage}`),
      avatarUrl: startup.avatarUrl || startup.logoUrl,
    })
  }

  for (const investor of results.investors) {
    rows.push({
      key: `investor-${investor.id}`,
      name: investor.firmName,
      href: investor.href,
      targetType: 'investor',
      targetId: investor.id,
      industry: investor.industry,
      description: investor.description,
      meta: [
        t('profiles.info.stats', {
          views: investor.views,
          connections: investor.connections,
        }),
      ],
      pillVariant: 'investor',
      pillLabel: t('find.type.investor'),
      avatarUrl: investor.avatarUrl || investor.logoUrl,
    })
  }

  return rows
}
