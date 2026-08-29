import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { facetChips } from '../app/utils/findChips'

describe('facetChips', () => {
  it('uses onRemove so draft state can stay in sync', () => {
    const values = ref(['Founder', 'Investor'])
    const removed: string[] = []

    const chips = facetChips(
      'role',
      values,
      v => v,
      true,
      (value) => {
        removed.push(value)
        values.value = values.value.filter(v => v !== value)
      },
    )

    chips.find(chip => chip.key === 'role:Founder')?.clear()

    expect(removed).toEqual(['Founder'])
    expect(values.value).toEqual(['Investor'])
  })
})
