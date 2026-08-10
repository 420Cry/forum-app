import type { OnboardDraftPayload } from '~/types/onboard/api'
import type { goalKeyType, roleTitlesType } from '~/types/onboard/onboardType'
import { isValidAdultDateOfBirth } from '~/utils/dateOfBirth'

export type OnboardDraftSource = {
  step: number
  role: '' | roleTitlesType
  goals: goalKeyType[]
  firstName: string
  lastName: string
  dateOfBirth: string
  location: string
  locationName?: string
  occupation: string
  occupationName?: string
  avatarUrl?: string | null
}

/** Builds a partial payload for PATCH /user/onboarding/draft (omits empty fields). */
export function buildOnboardDraftPayload(
  source: OnboardDraftSource,
): OnboardDraftPayload {
  const payload: OnboardDraftPayload = { step: source.step }

  if (source.role) payload.role = source.role
  if (source.goals.length > 0) payload.goals = [...source.goals]
  // Match draft DTO mins so mid-typing values don't spam 400s.
  if (source.firstName.length >= 2) payload.firstName = source.firstName
  if (source.lastName.length >= 2) payload.lastName = source.lastName
  if (source.dateOfBirth && isValidAdultDateOfBirth(source.dateOfBirth)) {
    payload.dateOfBirth = source.dateOfBirth
  }
  if (source.location.length >= 2) {
    payload.location = source.location
    if (source.locationName?.trim()) {
      payload.locationName = source.locationName.trim()
    }
  }
  if (source.occupation.length >= 2) {
    payload.occupation = source.occupation
    if (source.occupationName?.trim()) {
      payload.occupationName = source.occupationName.trim()
    }
  }
  if (source.avatarUrl) payload.avatarUrl = source.avatarUrl

  return payload
}
