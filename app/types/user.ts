export type UserProfile = {
  onboarded: boolean
  role: 'Founder' | 'Investor' | null
  name: string | null
  occupation: string | null
  age: number | null
  location: string | null
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
  return isOnboardingComplete(profile) ? '/home' : '/onboard'
}
