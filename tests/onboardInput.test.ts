import { describe, expect, it } from 'vitest'
import { sanitizeAgeInput, sanitizePersonName } from '~/utils/onboardInput'

describe('sanitizePersonName', () => {
  it('removes digits and symbols', () => {
    expect(sanitizePersonName('Alex123!')).toBe('Alex')
    expect(sanitizePersonName('Nguyễn')).toBe('Nguyễn')
  })
})

describe('sanitizeAgeInput', () => {
  it('keeps digits only', () => {
    expect(sanitizeAgeInput('28')).toBe('28')
    expect(sanitizeAgeInput('char28x')).toBe('28')
    expect(sanitizeAgeInput('abc')).toBe('')
  })
})
