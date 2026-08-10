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
  /** Calendar date `YYYY-MM-DD`. */
  dateOfBirth: string
  location: string
  /** Display name when saving a new Places-derived location key. */
  locationName?: string
  occupation: string
  /** Display name when saving a new free-text occupation key. */
  occupationName?: string
}

export type ProfileUpdatePayload = Partial<OnboardPayload> & {
  avatarUrl?: string | null
  urlKey?: string
}

export type OnboardDraftPayload = Partial<OnboardPayload> & {
  step?: number
  avatarUrl?: string | null
}
