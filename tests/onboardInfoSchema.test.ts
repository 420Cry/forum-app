import { describe, expect, it } from 'vitest'
import { createOnboardInfoSchema } from '~/types/onboard/schema/onboardInfoSchema'

const t = (key: string) => key

describe('createOnboardInfoSchema', () => {
  const schema = createOnboardInfoSchema(t)

  it('accepts valid onboarding info', () => {
    const result = schema.safeParse({
      firstName: 'Dao',
      lastName: 'Nguyen',
      age: '28',
      location: 'Hanoi',
      occupation: 'Founder',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({
        firstName: 'Dao',
        lastName: 'Nguyen',
        age: 28,
        location: 'Hanoi',
        occupation: 'Founder',
      })
    }
  })

  it('rejects names with special characters', () => {
    const result = schema.safeParse({
      firstName: 'Dao!',
      lastName: 'Nguyen',
      age: 28,
      location: 'Hanoi',
      occupation: 'Founder',
    })

    expect(result.success).toBe(false)
  })

  it('rejects ages outside allowed range', () => {
    const tooYoung = schema.safeParse({
      firstName: 'Dao',
      lastName: 'Nguyen',
      age: 4,
      location: 'Hanoi',
      occupation: 'Founder',
    })
    const tooOld = schema.safeParse({
      firstName: 'Dao',
      lastName: 'Nguyen',
      age: 101,
      location: 'Hanoi',
      occupation: 'Founder',
    })

    expect(tooYoung.success).toBe(false)
    expect(tooOld.success).toBe(false)
  })
})
