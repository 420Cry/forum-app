export type UserProfile = {
  // Keep in sync with forum-api/src/contracts/auth-me.ts (AUTH_PROFILE_KEYS).
  onboarded: boolean
  onboardingStep: number | null
  role: 'Founder' | 'Investor' | null
  name: string | null
  occupation: string | null
  age: number | null
  dateOfBirth: string | null
  location: string | null
  avatarUrl: string | null
  urlKey: string | null
  profilePath: string | null
  goals: string[]
}

export type AuthMeResponse = {
  id: string | null
  email: string | null
  profile: UserProfile | null
}

export function isOnboardingComplete(
  profile: UserProfile | null | undefined,
): boolean {
  return profile?.onboarded === true
}

export function postAuthPath(profile: UserProfile | null | undefined): string {
  return isOnboardingComplete(profile) ? '/social' : '/onboard'
}

/** Resume step from server draft, or infer from saved profile fields. */
export function inferOnboardingStep(
  profile: UserProfile | null | undefined,
): number {
  if (profile?.onboardingStep != null) return profile.onboardingStep
  if (!profile?.role) return 1
  if (!profile.goals.length) return 2
  return 3
}
