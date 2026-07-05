import * as z from 'zod'

const noSpecialChars = /^[a-zA-Z0-9\s]+$/

export function createOnboardInfoSchema(t: (key: string) => string) {
  return z.object({
    firstName: z
      .string(t('onboard.error.first_name_required'))
      .min(2, t('onboard.error.first_name_min'))
      .regex(noSpecialChars, t('onboard.error.first_name_special')),
    lastName: z
      .string(t('onboard.error.last_name_required'))
      .min(2, t('onboard.error.last_name_min'))
      .regex(noSpecialChars, t('onboard.error.last_name_special')),
    age: z.coerce
      .number()
      .pipe(
        z
          .number(t('onboard.error.age_required'))
          .min(5, t('onboard.error.age_min'))
          .max(100, t('onboard.error.age_max')),
      ),
    location: z
      .string(t('onboard.error.location_required'))
      .min(2, t('onboard.error.location_min'))
      .regex(noSpecialChars, t('onboard.error.location_special')),
    occupation: z
      .string(t('onboard.error.occupation_required'))
      .min(2, t('onboard.error.occupation_min'))
      .regex(noSpecialChars, t('onboard.error.occupation_special')),
  })
}

export type OnboardInfo = z.infer<ReturnType<typeof createOnboardInfoSchema>>
