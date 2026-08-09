import type { AccountSummary, AccountSummaryView } from '~/types/profile'
import { getAvatarColor } from '~/utils/avatarColor'

export function accountNamePrefix(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return (parts[0]![0] ?? '?').toUpperCase()
  return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase()
}

export function toAccountSummaryView(
  account: AccountSummary,
): AccountSummaryView {
  return {
    ...account,
    subtitle: account.headline ?? '',
    avatar: account.avatarUrl ?? '',
    prefix: accountNamePrefix(account.name),
    avatarColor: getAvatarColor(account.id || account.name),
    avatarLoadFailed: false,
  }
}
