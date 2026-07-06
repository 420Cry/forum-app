import type { goalKeyType, roleTitlesType } from './onboardType'

export interface OnboardResponse {
  success: boolean
  message: string
}

export interface OnboardPayload {
  role: roleTitlesType
  goals: goalKeyType[]
  firstName: string
  lastName: string
  age: number
  location: string
  occupation: string
}

export type ProfileUpdatePayload = Partial<OnboardPayload>
