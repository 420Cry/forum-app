import { describe, expect, it } from 'vitest'
import { sanitizePersonName } from '~/utils/onboardInput'

describe('sanitizePersonName', () => {
  it('keeps letters, spaces, hyphens, and apostrophes', () => {
    expect(sanitizePersonName('Mary-Jane O\'Neil')).toBe('Mary-Jane O\'Neil')
  })

  it('strips digits and symbols', () => {
    expect(sanitizePersonName('Alex2!')).toBe('Alex')
  })
})
