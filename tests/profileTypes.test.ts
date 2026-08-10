import { describe, expect, it } from 'vitest'
import {
  accountNamePrefix,
  toAccountSummaryView,
} from '~/utils/accountSummary'
import type { AccountSummary } from '~/types/profile'

describe('accountNamePrefix', () => {
  it('builds initials from one or two name parts', () => {
    expect(accountNamePrefix('Alex')).toBe('A')
    expect(accountNamePrefix('Alex Morgan')).toBe('AM')
    expect(accountNamePrefix('  Hello World Co  ')).toBe('HC')
    expect(accountNamePrefix('')).toBe('?')
  })
})

describe('toAccountSummaryView', () => {
  it('maps API summary fields for the account switcher', () => {
    const summary: AccountSummary = {
      id: 'acc-1',
      name: 'HelloWorld',
      headline: 'Climate / pre_seed',
      location: null,
      avatarUrl: 'https://cdn.example.com/a.png',
      href: '/startup/acc-1',
      accountType: 'startup',
    }

    const view = toAccountSummaryView(summary)

    expect(view.subtitle).toBe('Climate / pre_seed')
    expect(view.avatar).toBe('https://cdn.example.com/a.png')
    expect(view.prefix).toBe('H')
    expect(view.avatarLoadFailed).toBe(false)
    expect(view.avatarColor).toMatch(/^linear-gradient/)
  })
})
