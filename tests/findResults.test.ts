import { describe, expect, it } from 'vitest'
import { flattenFindResults } from '../app/utils/findResults'
import type { FindResults } from '../app/types/profile'

const empty = (): FindResults => ({
  users: [],
  startups: [],
  investors: [],
})

describe('flattenFindResults', () => {
  it('uses occupationLabel callback for user occupation display', () => {
    const results: FindResults = {
      ...empty(),
      users: [
        {
          id: 'u1',
          urlKey: 'ada',
          name: 'Ada',
          profilePath: '/u/ada',
          role: 'Founder',
          occupation: 'AI Director',
          occupationKey: 'ai_director',
          location: 'Amsterdam, Netherlands',
          locationKey: 'city_nl_nh_amsterdam',
          avatarUrl: null,
          goals: [],
        },
      ],
    }

    const rows = flattenFindResults(
      results,
      key => key,
      () => false,
      'vn',
      (key, fallback) => (key === 'ai_director' ? 'Giám đốc AI' : fallback),
    )

    expect(rows).toHaveLength(1)
    expect(rows[0]?.industry).toBe('Giám đốc AI')
    expect(rows[0]?.meta).toContain('Amsterdam, Netherlands')
  })
})
