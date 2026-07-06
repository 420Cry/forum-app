import { describe, expect, it } from 'vitest'
import { createOnboardInfoSchema } from '~/types/onboard/schema/onboardInfoSchema'

const t = (key: string) => key

describe('createOnboardInfoSchema', () => {
  const schema = createOnboardInfoSchema(t)

  it('accepts valid onboarding info', () => {
    const result = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      age: '28',
      location: 'Austin',
      occupation: 'Founder',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        firstName: 'Alex',
        lastName: 'Morgan',
        age: 28,
        location: 'Austin',
        occupation: 'Founder',
      })
    }
  })

  it('rejects names with special characters', () => {
    const result = schema.safeParse({
      firstName: 'Alex!',
      lastName: 'Morgan',
      age: '28',
      location: 'Austin',
      occupation: 'Founder',
    })

    expect(result.success).toBe(false)
  })

  it('rejects names with numbers', () => {
    const result = schema.safeParse({
      firstName: 'Alex2',
      lastName: 'Morgan',
      age: '28',
      location: 'Austin',
      occupation: 'Founder',
    })

    expect(result.success).toBe(false)
  })

  it('rejects non-numeric age values', () => {
    const result = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      age: 'char',
      location: 'Austin',
      occupation: 'Founder',
    })

    expect(result.success).toBe(false)
  })

  it('rejects age 16 or younger', () => {
    const tooYoung = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      age: '16',
      location: 'Austin',
      occupation: 'Founder',
    })

    expect(tooYoung.success).toBe(false)
  })

  it('accepts age 17 and above with no upper limit', () => {
    const valid = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      age: '17',
      location: 'Austin',
      occupation: 'Founder',
    })
    const older = schema.safeParse({
      firstName: 'Alex',
      lastName: 'Morgan',
      age: '101',
      location: 'Austin',
      occupation: 'Founder',
    })

    expect(valid.success).toBe(true)
    expect(older.success).toBe(true)
  })
})
