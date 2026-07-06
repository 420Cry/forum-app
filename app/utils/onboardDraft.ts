import type { OnboardDraftPayload } from '~/types/onboard/api'
import type { goalKeyType, roleTitlesType } from '~/types/onboard/onboardType'

export type OnboardDraftSource = {
  step: number
  role: '' | roleTitlesType
  goals: goalKeyType[]
  firstName: string
  lastName: string
  age: string
  location: string
  occupation: string
}

/** Builds a partial payload for PATCH /user/onboarding/draft (omits empty fields). */
export function buildOnboardDraftPayload(
  source: OnboardDraftSource,
): OnboardDraftPayload {
  const payload: OnboardDraftPayload = { step: source.step }

  if (source.role) payload.role = source.role
  if (source.goals.length > 0) payload.goals = [...source.goals]
  if (source.firstName) payload.firstName = source.firstName
  if (source.lastName) payload.lastName = source.lastName
  if (source.age) {
    const age = Number(source.age)
    if (!Number.isNaN(age)) payload.age = age
  }
  if (source.location) payload.location = source.location
  if (source.occupation) payload.occupation = source.occupation

  return payload
}
