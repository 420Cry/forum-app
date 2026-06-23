import * as z from "zod";

const noSpecialChars = /^[a-zA-Z0-9\s]+$/;

export const Info = z.object({
  firstName: z
    .string("First name required")
    .min(1, "First name is required")
    .regex(noSpecialChars, "First name must not contain special characters"),
  lastName: z
    .string("Last name required")
    .min(1, "Last name is required")
    .regex(noSpecialChars, "Last name must not contain special characters"),
  age: z.string("Age required").min(1, "Age is required"),
  location: z
    .string("Location required")
    .min(1, "Location is required")
    .regex(noSpecialChars, "Location must not contain special characters"),
  occupation: z
    .string("Occupation required")
    .min(1, "Occupation is required")
    .regex(noSpecialChars, "Occupation must not contain special characters"),
});

export type Info = z.infer<typeof Info>;
