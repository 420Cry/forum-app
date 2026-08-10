import { describe, expect, it } from 'vitest'
import {
  goalCatalogLabel,
  locationCatalogLabel,
  occupationCatalogLabel,
} from '~/utils/catalogLabel'

const en: Record<string, string> = {
  'catalog.location.remote': 'Remote',
  'catalog.occupation.founder': 'Founder',
  'catalog.occupation_domain.ai': 'AI',
  'catalog.occupation_role.engineer': 'Engineer',
  'catalog.occupation_seniority.senior': 'Senior',
  'catalog.occupation.software_engineer': 'Software Engineer',
  'onboard.heading.goal_raise_capital': 'Raise capital',
}

const vn: Record<string, string> = {
  'catalog.location.remote': 'Từ xa',
  'catalog.occupation.founder': 'Nhà sáng lập',
  'catalog.occupation_domain.ai': 'AI',
  'catalog.occupation_role.engineer': 'Kỹ sư',
  'catalog.occupation_seniority.senior': 'Cấp cao',
  'catalog.occupation.software_engineer': 'Kỹ sư phần mềm',
  'onboard.heading.goal_raise_capital': 'Gọi vốn',
}

function makeI18n(map: Record<string, string>) {
  const te = (key: string) => key in map
  const t = (key: string) => map[key] ?? key
  return { t, te }
}

describe('catalogLabel', () => {
  it('translates fixed location seeds', () => {
    const { t, te } = makeI18n(vn)
    expect(locationCatalogLabel('remote', 'Remote', t, te)).toBe('Từ xa')
  })

  it('translates exact occupation keys', () => {
    const { t, te } = makeI18n(vn)
    expect(occupationCatalogLabel('founder', 'Founder', t, te)).toBe(
      'Nhà sáng lập',
    )
  })

  it('composes domain + role occupations', () => {
    const { t, te } = makeI18n(vn)
    expect(occupationCatalogLabel('ai_engineer', 'AI Engineer', t, te)).toBe(
      'AI Kỹ sư',
    )
  })

  it('composes seniority when base is translated', () => {
    const { t, te } = makeI18n({
      'catalog.occupation_domain.ai': 'AI',
      'catalog.occupation_role.engineer': 'Kỹ sư',
      'catalog.occupation_seniority.senior': 'Cấp cao',
    })
    expect(
      occupationCatalogLabel('senior_ai_engineer', 'Senior AI Engineer', t, te),
    ).toBe('Cấp cao AI Kỹ sư')
  })

  it('falls back to API name when untranslated', () => {
    const { t, te } = makeI18n(en)
    expect(
      occupationCatalogLabel('obscure_title', 'Obscure Title', t, te),
    ).toBe('Obscure Title')
  })

  it('translates goal keys', () => {
    const { t, te } = makeI18n(vn)
    expect(goalCatalogLabel('raise_capital', 'Raise capital', t, te)).toBe(
      'Gọi vốn',
    )
  })
})
