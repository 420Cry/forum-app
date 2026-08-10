import * as z from 'zod'
import { PERSON_NAME_RE, TAG_KEY_RE } from '~/utils/onboardInput'
import {
  DATE_OF_BIRTH_RE,
  MAX_AGE,
  MIN_AGE,
  ageFromDateOfBirth,
  isValidAdultDateOfBirth,
} from '~/utils/dateOfBirth'

export function createOnboardInfoSchema(t: (key: string) => string) {
  return z.object({
    firstName: z
      .string(t('onboard.error.first_name_required'))
      .min(2, t('onboard.error.first_name_min'))
      .regex(PERSON_NAME_RE, t('onboard.error.first_name_special')),
    lastName: z
      .string(t('onboard.error.last_name_required'))
      .min(2, t('onboard.error.last_name_min'))
      .regex(PERSON_NAME_RE, t('onboard.error.last_name_special')),
    dateOfBirth: z
      .string(t('onboard.error.dob_required'))
      .min(1, t('onboard.error.dob_required'))
      .regex(DATE_OF_BIRTH_RE, t('onboard.error.dob_invalid'))
      .refine(val => isValidAdultDateOfBirth(val), {
        message: t('onboard.error.dob_invalid'),
      })
      .refine((val) => {
        const age = ageFromDateOfBirth(val)
        return age != null && age >= MIN_AGE
      }, { message: t('onboard.error.dob_too_young') })
      .refine((val) => {
        const age = ageFromDateOfBirth(val)
        return age != null && age <= MAX_AGE
      }, { message: t('onboard.error.dob_too_old') }),
    location: z
      .string(t('onboard.error.location_required'))
      .min(1, t('onboard.error.location_required'))
      .regex(TAG_KEY_RE, t('onboard.error.location_invalid')),
    occupation: z
      .string(t('onboard.error.occupation_required'))
      .min(1, t('onboard.error.occupation_required'))
      .regex(TAG_KEY_RE, t('onboard.error.occupation_invalid')),
  })
}

export type OnboardInfo = z.infer<ReturnType<typeof createOnboardInfoSchema>>
