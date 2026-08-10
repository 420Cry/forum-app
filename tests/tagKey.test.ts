import { describe, expect, it } from 'vitest'
import { textToTagKey } from '~/utils/tagKey'

describe('textToTagKey', () => {
  it('slugifies free-text titles', () => {
    expect(textToTagKey('Software Engineer')).toBe('software_engineer')
    expect(textToTagKey('  Product Manager  ')).toBe('product_manager')
  })
})
