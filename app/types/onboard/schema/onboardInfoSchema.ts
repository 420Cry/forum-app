import * as z from 'zod'
import {
  AGE_DIGITS_RE,
  LOCATION_OCCUPATION_RE,
  PERSON_NAME_RE,
} from '~/utils/onboardInput'

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
    age: z
      .string(t('onboard.error.age_required'))
      .min(1, t('onboard.error.age_required'))
      .regex(AGE_DIGITS_RE, t('onboard.error.age_invalid'))
      .transform(val => Number(val))
      .pipe(
        z.number().gt(16, t('onboard.error.age_min')),
      ),
    location: z
      .string(t('onboard.error.location_required'))
      .min(2, t('onboard.error.location_min'))
      .regex(LOCATION_OCCUPATION_RE, t('onboard.error.location_special')),
    occupation: z
      .string(t('onboard.error.occupation_required'))
      .min(2, t('onboard.error.occupation_min'))
      .regex(LOCATION_OCCUPATION_RE, t('onboard.error.occupation_special')),
  })
}

export type OnboardInfo = z.infer<ReturnType<typeof createOnboardInfoSchema>>
