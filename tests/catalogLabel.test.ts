import { describe, expect, it } from 'vitest'
import {
  goalCatalogLabel,
  locationCatalogLabel,
  occupationCatalogLabel,
} from '../app/utils/catalogLabel'

describe('catalogLabel', () => {
  it('maps location seeds from i18n when present', () => {
    const t = (key: string) => (key === 'catalog.location.remote' ? 'Remote' : key)
    const te = (key: string) => key === 'catalog.location.remote'
    expect(locationCatalogLabel('remote', 'Remote', t, te)).toBe('Remote')
    expect(locationCatalogLabel('hanoi', 'Hanoi', t, te)).toBe('Hanoi')
  })

  it('passes through occupation fallback (labels come from BE)', () => {
    expect(
      occupationCatalogLabel('ai_director', 'Giám đốc AI', () => '', () => false, 'vn'),
    ).toBe('Giám đốc AI')
    expect(
      occupationCatalogLabel('founder', 'Founder', () => '', () => false),
    ).toBe('Founder')
  })

  it('maps goal keys from onboard headings', () => {
    const t = (key: string) =>
      key === 'onboard.heading.goal_raise_capital' ? 'Raise capital' : key
    const te = (key: string) => key.startsWith('onboard.heading.goal_')
    expect(goalCatalogLabel('raise_capital', 'raise_capital', t, te)).toBe(
      'Raise capital',
    )
  })
})
