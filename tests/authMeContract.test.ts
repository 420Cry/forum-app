import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { UserProfile } from '~/types/user'

const API_CONTRACT = resolve(
  import.meta.dirname,
  '../../../forum-api/src/contracts/auth-me.ts',
)

function readApiProfileKeys(): string[] {
  if (!existsSync(API_CONTRACT)) return []
  const source = readFileSync(API_CONTRACT, 'utf8')
  const match = source.match(
    /export const AUTH_PROFILE_KEYS = \[([\s\S]*?)\] as const/,
  )
  if (!match) return []
  return [...match[1].matchAll(/'([^']+)'/g)].map(m => m[1])
}

describe('auth profile contract', () => {
  it('UserProfile keys match forum-api/src/contracts/auth-me.ts', () => {
    const apiKeys = readApiProfileKeys()
    if (apiKeys.length === 0) {
      // forum-api sibling not checked out (e.g. isolated app-only CI clone).
      return
    }

    const sample: UserProfile = {
      onboarded: true,
      onboardingStep: null,
      role: 'Investor',
      name: 'Alex',
      occupation: null,
      age: null,
      dateOfBirth: null,
      location: null,
      avatarUrl: null,
      urlKey: 'alex',
      profilePath: '/u/alex',
      goals: [],
    }

    expect(Object.keys(sample).sort()).toEqual([...apiKeys].sort())
  })
})
