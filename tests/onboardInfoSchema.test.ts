import { describe, expect, it } from 'vitest'
import { createOnboardInfoSchema } from '~/types/onboard/schema/onboardInfoSchema'

const t = (key: string) => key

/** Fixed adult DOB (~28 years as of 2026). */
const adultDob = '1998-01-15'
const tooYoungDob = '2015-01-01'
const tooOldDob = '1890-01-01'

describe('createOnboardInfoSchema', () => {
  const schema = createOnboardInfoSchema(t)

  it('accepts valid onboarding info', () => {
    const result = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      dateOfBirth: adultDob,
      location: 'austin-us',
      occupation: 'founder',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        firstName: 'Alex',
        lastName: 'Morgan',
        dateOfBirth: adultDob,
        location: 'austin-us',
        occupation: 'founder',
      })
    }
  })

  it('rejects names with special characters', () => {
    const result = schema.safeParse({
      firstName: 'Alex!',
      lastName: 'Morgan',
      dateOfBirth: adultDob,
      location: 'austin-us',
      occupation: 'founder',
    })

    expect(result.success).toBe(false)
  })

  it('rejects names with numbers', () => {
    const result = schema.safeParse({
      firstName: 'Alex2',
      lastName: 'Morgan',
      dateOfBirth: adultDob,
      location: 'austin-us',
      occupation: 'founder',
    })

    expect(result.success).toBe(false)
  })

  it('rejects invalid date of birth', () => {
    const result = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      dateOfBirth: 'not-a-date',
      location: 'austin-us',
      occupation: 'founder',
    })

    expect(result.success).toBe(false)
  })

  it('rejects underage date of birth', () => {
    const tooYoung = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      dateOfBirth: tooYoungDob,
      location: 'austin-us',
      occupation: 'founder',
    })

    expect(tooYoung.success).toBe(false)
    if (!tooYoung.success) {
      expect(tooYoung.error.issues[0]?.message).toBe(
        'onboard.error.dob_too_young',
      )
    }
  })

  it('rejects future date of birth with future message', () => {
    const future = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      dateOfBirth: '2027-01-15',
      location: 'austin-us',
      occupation: 'founder',
    })

    expect(future.success).toBe(false)
    if (!future.success) {
      expect(future.error.issues[0]?.message).toBe('onboard.error.dob_future')
    }
  })

  it('rejects out-of-range date of birth', () => {
    const tooOld = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      dateOfBirth: tooOldDob,
      location: 'austin-us',
      occupation: 'founder',
    })

    expect(tooOld.success).toBe(false)
  })

  it('rejects free-text location/occupation', () => {
    const result = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      dateOfBirth: adultDob,
      location: 'Austin, US',
      occupation: 'Founder & researcher',
    })
    expect(result.success).toBe(false)
  })
})
