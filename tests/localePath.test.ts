import { describe, expect, it } from 'vitest'
import { stripLocalePrefix } from '~/utils/localePath'

describe('stripLocalePrefix', () => {
  it('strips /en and /vn prefixes', () => {
    expect(stripLocalePrefix('/en/home')).toBe('/home')
    expect(stripLocalePrefix('/vn/auth/login')).toBe('/auth/login')
  })

  it('maps locale root to /', () => {
    expect(stripLocalePrefix('/en')).toBe('/')
    expect(stripLocalePrefix('/vn')).toBe('/')
  })

  it('leaves unprefixed paths unchanged', () => {
    expect(stripLocalePrefix('/home')).toBe('/home')
    expect(stripLocalePrefix('/auth/login')).toBe('/auth/login')
  })
})
