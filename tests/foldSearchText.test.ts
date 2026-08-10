import { describe, expect, it } from 'vitest'
import { foldSearchText } from '~/utils/foldSearchText'

describe('foldSearchText', () => {
  it('strips diacritics and lowercases', () => {
    expect(foldSearchText('Kỹ sư')).toBe('ky su')
    expect(foldSearchText('Hà Nội')).toBe('ha noi')
    expect(foldSearchText('Đà Nẵng')).toBe('da nang')
  })
})
