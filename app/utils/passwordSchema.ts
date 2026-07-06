import * as z from 'zod'

const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/

export type PasswordRequirementKey
  = | 'auth.info.password_req_min_length'
    | 'auth.info.password_req_number'
    | 'auth.info.password_req_uppercase'
    | 'auth.info.password_req_lowercase'
    | 'auth.info.password_req_special'

export const passwordRequirementKeys: PasswordRequirementKey[] = [
  'auth.info.password_req_min_length',
  'auth.info.password_req_number',
  'auth.info.password_req_uppercase',
  'auth.info.password_req_lowercase',
  'auth.info.password_req_special',
]

export function getPasswordChecks(password: string) {
  return {
    minLength: password.length >= 8,
    number: /\d/.test(password),
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    special: SPECIAL_CHAR_REGEX.test(password),
  }
}

export function isPasswordValid(password: string) {
  const checks = getPasswordChecks(password)
  return Object.values(checks).every(Boolean)
}

export function createPasswordSchema(t: (key: string) => string) {
  return z
    .string()
    .min(8, t('auth.error.password_min_length'))
    .regex(/\d/, t('auth.error.password_number'))
    .regex(/[A-Z]/, t('auth.error.password_uppercase'))
    .regex(/[a-z]/, t('auth.error.password_lowercase'))
    .regex(SPECIAL_CHAR_REGEX, t('auth.error.password_special'))
}
