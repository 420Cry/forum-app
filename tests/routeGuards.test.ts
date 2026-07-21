import { describe, expect, it, vi } from 'vitest'
import { onboardingRedirect, resolveVerifiedUser } from '~/utils/routeGuards'
import type { UserProfile } from '~/types/user'

function makeSupabase(fetchedUser: unknown = null) {
  return {
    auth: {
      refreshSession: vi.fn().mockResolvedValue({}),
      getUser: vi.fn().mockResolvedValue({ data: { user: fetchedUser } }),
    },
  }
}

const verifiedUser = { id: 'u1', email_confirmed_at: '2026-01-01T00:00:00Z' }
const unverifiedUser = { id: 'u2', email_confirmed_at: null }

describe('resolveVerifiedUser', () => {
  it('returns none without a session access token', async () => {
    const result = await resolveVerifiedUser(makeSupabase(), null, null)
    expect(result).toEqual({ status: 'none', user: null })
  })

  it('classifies a verified user from local state', async () => {
    const supabase = makeSupabase()
    const session = { access_token: 'token' } as never

    const result = await resolveVerifiedUser(supabase, session, verifiedUser)

    expect(result.status).toBe('verified')
    expect(result.user).toMatchObject({ id: 'u1' })
    expect(supabase.auth.refreshSession).not.toHaveBeenCalled()
  })

  it('classifies an unverified user', async () => {
    const session = { access_token: 'token' } as never
    const result = await resolveVerifiedUser(
      makeSupabase(),
      session,
      unverifiedUser,
    )
    expect(result.status).toBe('unverified')
  })

  it('falls back to refresh + getUser when user is missing locally', async () => {
    const supabase = makeSupabase(verifiedUser)
    const session = { access_token: 'token' } as never

    const result = await resolveVerifiedUser(supabase, session, null)

    expect(supabase.auth.refreshSession).toHaveBeenCalled()
    expect(result.status).toBe('verified')
  })

  it('returns none when no user can be resolved at all', async () => {
    const session = { access_token: 'token' } as never
    const result = await resolveVerifiedUser(makeSupabase(), session, null)
    expect(result).toEqual({ status: 'none', user: null })
  })
})

describe('onboardingRedirect', () => {
  const complete = { onboarded: true } as UserProfile
  const incomplete = { onboarded: false } as UserProfile

  it('sends not-onboarded users from /home to /onboard', () => {
    expect(onboardingRedirect('/social', incomplete)).toBe('/onboard')
    expect(onboardingRedirect('/social', null)).toBe('/onboard')
  })

  it('sends onboarded users from /onboard to /social', () => {
    expect(onboardingRedirect('/onboard', complete)).toBe('/social')
  })

  it('lets users stay when the route matches their state', () => {
    expect(onboardingRedirect('/social', complete)).toBeNull()
    expect(onboardingRedirect('/onboard', incomplete)).toBeNull()
    expect(onboardingRedirect('/onboard', null)).toBeNull()
  })

  it('never redirects other paths', () => {
    expect(onboardingRedirect('/somewhere', complete)).toBeNull()
    expect(onboardingRedirect('/somewhere', null)).toBeNull()
  })

  it('handles locale-prefixed paths', () => {
    expect(onboardingRedirect('/en/social', incomplete)).toBe('/onboard')
    expect(onboardingRedirect('/vn/onboard', complete)).toBe('/social')
    expect(onboardingRedirect('/en/social', complete)).toBeNull()
  })
})
