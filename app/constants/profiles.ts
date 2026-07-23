import type { AccountSummary } from '~/types/profile'

/* Mock /me/accounts response — the accounts a user can act as (personal +
   startup/investor pages). useAccount enriches these into AccountSummaryView. */
export const profileExample: AccountSummary[] = [
  {
    id: '1',
    name: 'Dao Nguyen',
    headline: 'Founder / Personal Account',
    location: 'Vietnam',
    avatar: '',
    accountType: 'user',
  },
  {
    id: '2',
    name: 'HelloWorld',
    headline: 'Climate / Preseed',
    location: 'Remote',
    avatar: '',
    views: '1000',
    connections: '200',
    accountType: 'startup',
  },
]
