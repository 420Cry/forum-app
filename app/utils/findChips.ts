import type { FindChip, FindOption } from '~/types/find'
import { removeValue } from '~/types/find'

/** Build removable chips for one multi-select facet. */
export function facetChips(
  facet: string,
  values: Ref<string[]>,
  labelOf: (value: string) => string,
  enabled = true,
  onRemove?: (value: string) => void,
): FindChip[] {
  if (!enabled) return []
  return values.value.map(value => ({
    key: `${facet}:${value}`,
    label: labelOf(value),
    clear: () => {
      if (onRemove) {
        onRemove(value)
        return
      }
      values.value = removeValue(values.value, value)
    },
  }))
}

export function optionLabel(
  options: FindOption[],
  value: string,
): string {
  return options.find(o => o.value === value)?.label ?? value
}
