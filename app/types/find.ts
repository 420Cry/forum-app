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

/** Directory type tabs shown in Find (org types hidden until setup exists). */
export const FIND_TYPE_TAB_FILTERS: { value: FindType, labelKey: string }[] = [
  { value: 'all', labelKey: 'find.type.all' },
  { value: 'user', labelKey: 'find.type.user' },
]

export const FIND_ROLE_QUICK_FILTERS: { value: string, labelKey: string }[] = [
  { value: 'Founder', labelKey: 'find.filter.role_founder' },
  { value: 'Investor', labelKey: 'find.filter.role_investor' },
]

export function joinCsv(values: string[]): string | undefined {
  return values.length ? values.join(',') : undefined
}

export function removeValue(list: string[], value: string): string[] {
  return list.filter(v => v !== value)
}
