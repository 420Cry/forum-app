import type { AccountType } from '~/types/profile'
import type { PillVariant } from '~/utils/stagePill'

export type FindType = 'all' | 'user' | 'startup' | 'investor'
export type FindMode = 'suggestions' | 'results'
export type FindSort = 'newest' | 'name'

export type FindOption = { value: string, label: string }

export type FindChip = {
  key: string
  label: string
  clear: () => void
}

export type FindResultRow = {
  key: string
  name: string
  href: string
  targetType: AccountType
  targetId: string
  industry: string | null
  description: string | null
  meta: string[]
  pillVariant: PillVariant | undefined
  pillLabel?: string
  avatarUrl: string | null
}

export const FIND_TYPE_FILTERS: { value: FindType, labelKey: string }[] = [
  { value: 'all', labelKey: 'find.type.all' },
  { value: 'user', labelKey: 'find.type.user' },
  { value: 'startup', labelKey: 'find.type.startup' },
  { value: 'investor', labelKey: 'find.type.investor' },
]

export function joinCsv(values: string[]): string | undefined {
  return values.length ? values.join(',') : undefined
}

export function removeValue(list: string[], value: string): string[] {
  return list.filter(v => v !== value)
}
