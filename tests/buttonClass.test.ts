import { describe, expect, it } from 'vitest'
import { buttonClass } from '~/utils/buttonClass'

describe('buttonClass', () => {
  it('applies primary interactive states', () => {
    const cls = buttonClass({ intent: 'primary' })
    expect(cls).toContain('bg-brand')
    expect(cls).toContain('hover:bg-brand-hover')
    expect(cls).toContain('active:bg-brand-active')
    expect(cls).toContain('focus-visible:outline-brand')
    expect(cls).toContain('disabled:opacity-50')
  })

  it('applies soft following-style intent', () => {
    const cls = buttonClass({ intent: 'soft', size: 'sm' })
    expect(cls).toContain('bg-surface-hover-2')
    expect(cls).toContain('min-h-8')
  })

  it('applies danger focus ring', () => {
    const cls = buttonClass({ intent: 'danger' })
    expect(cls).toContain('bg-danger')
    expect(cls).toContain('focus-visible:outline-danger')
  })
})
