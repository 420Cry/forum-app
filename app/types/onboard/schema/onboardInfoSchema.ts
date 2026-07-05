import * as z from 'zod'

const noSpecialChars = /^[a-zA-Z0-9\s]+$/

export const OnboardInfo = z.object({
  firstName: z
    .string('First name required')
    .min(2, 'First name must have at least 2 characters')
    .regex(noSpecialChars, 'First name must not contain special characters'),
  lastName: z
    .string('Last name required')
    .min(2, 'Last name must have at least 2 characters')
    .regex(noSpecialChars, 'Last name must not contain special characters'),
  age: z.coerce
    .number()
    .pipe(
      z
        .number('Age required')
        .min(5, 'Age cannot be lower than 5')
        .max(100, 'Age cannot be bigger than 100'),
    ),
  location: z
    .string('Location required')
    .min(2, 'Location must have at least 2 characters')
    .regex(noSpecialChars, 'Location must not contain special characters'),
  occupation: z
    .string('Occupation required')
    .min(2, 'Occupation must have at least 2 characters')
    .regex(noSpecialChars, 'Occupation must not contain special characters'),
})

export type OnboardInfo = z.infer<typeof OnboardInfo>
