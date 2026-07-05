export type OnboardProcess
  = | 'RoleSelection'
    | 'GoalSelection'
    | 'BasicInfo'
    | 'Completed'

export type UserProfile = {
  onboard_process: OnboardProcess
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
  return profile?.onboard_process === 'Completed'
}

export function onboardStepFromProcess(
  process: OnboardProcess | null | undefined,
): number {
  if (!process || process === 'Completed') return 1
  const stepByProcess: Record<Exclude<OnboardProcess, 'Completed'>, number> = {
    RoleSelection: 1,
    GoalSelection: 2,
    BasicInfo: 3,
  }
  return stepByProcess[process]
}

export function postAuthPath(profile: UserProfile | null | undefined): string {
  return isOnboardingComplete(profile) ? '/home' : '/onboard'
}
