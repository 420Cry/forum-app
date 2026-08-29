import { describe, expect, it } from 'vitest'
import { buildFindQuery, resolveApiType } from '../app/composables/find/findDirectoryQuery'

const peopleVisibility = {
  showPeopleFilters: true,
  showOrgFilters: true,
  showStageFilter: true,
}

describe('resolveApiType', () => {
  it('narrows to user when people facets are set on All', () => {
    expect(
      resolveApiType(
        'all',
        false,
        peopleVisibility,
        { location: [], occupation: [], role: ['Founder'] },
      ),
    ).toBe('user')
  })

  it('keeps explicit People tab type', () => {
    expect(
      resolveApiType(
        'user',
        false,
        peopleVisibility,
        { location: [], occupation: [], role: [] },
      ),
    ).toBe('user')
  })
})

describe('buildFindQuery', () => {
  it('sends role filter in results mode', () => {
    expect(
      buildFindQuery('results', {
        q: '',
        type: 'all',
        sort: 'newest',
        facets: {
          industry: [],
          location: [],
          occupation: [],
          role: ['Investor'],
          stage: [],
        },
        visibility: peopleVisibility,
      }),
    ).toMatchObject({
      type: 'user',
      role: 'Investor',
    })
  })
})
