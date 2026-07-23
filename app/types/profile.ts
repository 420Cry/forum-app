// Raw account summary as sent by the API (mirrors app/constants/profiles.ts).
// One entry per account the user can act as (personal + startup/investor pages).
export type AccountSummary = {
  id: string
  name: string
  headline?: string
  location: string
  avatar: string
  views?: string
  connections?: string
  accountType: 'user' | 'startup' | 'investor'
}

// What components consume: the raw summary plus fields derived/managed on the
// client. prefix + avatarColor are computed from the raw data; avatarLoadFailed
// is UI state.
export type AccountSummaryView = AccountSummary & {
  prefix: string
  avatarColor: string
  avatarLoadFailed: boolean
}
