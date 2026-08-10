import { describe, expect, it } from 'vitest'
import { buildOnboardDraftPayload } from '~/utils/onboardDraft'

const emptySource = {
  step: 1,
  role: '' as const,
  goals: [] as const,
  firstName: '',
  lastName: '',
  dateOfBirth: '',
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

  it('includes date of birth and goal keys when present', () => {
    expect(
      buildOnboardDraftPayload({
        step: 3,
        role: 'Investor',
        goals: ['raise_capital', 'discover_startups'],
        firstName: 'Ada',
        lastName: 'Lovelace',
        dateOfBirth: '1996-01-15',
        location: 'London',
        occupation: 'Angel',
      }),
    ).toEqual({
      step: 3,
      role: 'Investor',
      goals: ['raise_capital', 'discover_startups'],
      firstName: 'Ada',
      lastName: 'Lovelace',
      dateOfBirth: '1996-01-15',
      location: 'London',
      occupation: 'Angel',
    })
  })

  it('skips invalid date of birth strings', () => {
    expect(
      buildOnboardDraftPayload({
        ...emptySource,
        dateOfBirth: 'not-a-date',
      }),
    ).toEqual({ step: 1 })
  })

  it('skips underage dates of birth', () => {
    expect(
      buildOnboardDraftPayload({
        ...emptySource,
        dateOfBirth: '2015-01-01',
      }),
    ).toEqual({ step: 1 })
  })

  it('includes locationName for Places picks', () => {
    expect(
      buildOnboardDraftPayload({
        ...emptySource,
        location: 'place_abc123',
        locationName: 'Hanoi, Vietnam',
      }),
    ).toEqual({
      step: 1,
      location: 'place_abc123',
      locationName: 'Hanoi, Vietnam',
    })
  })
})
