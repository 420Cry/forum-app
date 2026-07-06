import { describe, expect, it } from 'vitest'
import { buildOnboardDraftPayload } from '~/utils/onboardDraft'

const emptySource = {
  step: 1,
  role: '' as const,
  goals: [] as const,
  firstName: '',
  lastName: '',
  age: '',
  location: '',
  occupation: '',
}

describe('buildOnboardDraftPayload', () => {
  it('always includes the current step', () => {
    expect(buildOnboardDraftPayload({ ...emptySource, step: 2 })).toEqual({
      step: 2,
    })
  })

  it('omits empty fields', () => {
    expect(
      buildOnboardDraftPayload({
        ...emptySource,
        role: 'Founder',
      }),
    ).toEqual({ step: 1, role: 'Founder' })
  })

  it('includes parsed age and goal keys when present', () => {
    expect(
      buildOnboardDraftPayload({
        step: 3,
        role: 'Investor',
        goals: ['raise_capital', 'discover_startups'],
        firstName: 'Ada',
        lastName: 'Lovelace',
        age: '30',
        location: 'London',
        occupation: 'Angel',
      }),
    ).toEqual({
      step: 3,
      role: 'Investor',
      goals: ['raise_capital', 'discover_startups'],
      firstName: 'Ada',
      lastName: 'Lovelace',
      age: 30,
      location: 'London',
      occupation: 'Angel',
    })
  })

  it('skips invalid age strings', () => {
    expect(
      buildOnboardDraftPayload({
        ...emptySource,
        age: 'not-a-number',
      }),
    ).toEqual({ step: 1 })
  })
})
