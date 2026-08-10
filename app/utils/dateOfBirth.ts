/** Calendar date as `YYYY-MM-DD`. */
export const DATE_OF_BIRTH_RE = /^\d{4}-\d{2}-\d{2}$/

export const MIN_AGE = 17
export const MAX_AGE = 120

function parseParts(raw: string): { y: number, m: number, d: number } | null {
  if (!DATE_OF_BIRTH_RE.test(raw)) return null
  const [ys, ms, ds] = raw.split('-')
  const y = Number(ys)
  const m = Number(ms)
  const d = Number(ds)
  const date = new Date(y, m - 1, d)
  if (
    date.getFullYear() !== y
    || date.getMonth() !== m - 1
    || date.getDate() !== d
  ) {
    return null
  }
  return { y, m, d }
}

export function ageFromDateOfBirth(
  raw: string,
  asOf: Date = new Date(),
): number | null {
  const parts = parseParts(raw)
  if (!parts) return null
  let age = asOf.getFullYear() - parts.y
  const monthDelta = asOf.getMonth() + 1 - parts.m
  if (
    monthDelta < 0
    || (monthDelta === 0 && asOf.getDate() < parts.d)
  ) {
    age -= 1
  }
  return age
}

export function isValidAdultDateOfBirth(
  raw: string,
  asOf: Date = new Date(),
): boolean {
  const parts = parseParts(raw)
  if (!parts) return false
  const dob = new Date(parts.y, parts.m - 1, parts.d)
  const today = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate())
  if (dob.getTime() > today.getTime()) return false
  const age = ageFromDateOfBirth(raw, asOf)
  if (age == null) return false
  return age >= MIN_AGE && age <= MAX_AGE
}

/** Max selectable date for `<input type="date">` (17th birthday). */
export function maxDateOfBirthInput(asOf: Date = new Date()): string {
  const d = new Date(asOf.getFullYear() - MIN_AGE, asOf.getMonth(), asOf.getDate())
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Max selectable date (~120 years). */
export function minDateOfBirthInput(asOf: Date = new Date()): string {
  const y = asOf.getFullYear() - MAX_AGE
  return `${y}-01-01`
}

type Translate = (key: string) => string

/** Field-level DOB message for inline validation (onboard / settings). */
export function dateOfBirthFieldError(
  raw: string,
  translate: Translate,
  asOf: Date = new Date(),
): string | null {
  const value = raw.trim()
  if (!value) return translate('onboard.error.dob_required')
  if (!DATE_OF_BIRTH_RE.test(value)) return translate('onboard.error.dob_invalid')

  const parts = parseParts(value)
  if (!parts) return translate('onboard.error.dob_invalid')

  const dob = new Date(parts.y, parts.m - 1, parts.d)
  const today = new Date(asOf.getFullYear(), asOf.getMonth(), asOf.getDate())
  if (dob.getTime() > today.getTime()) {
    return translate('onboard.error.dob_future')
  }

  const age = ageFromDateOfBirth(value, asOf)
  if (age == null) return translate('onboard.error.dob_invalid')
  if (age < MIN_AGE) return translate('onboard.error.dob_too_young')
  if (age > MAX_AGE) return translate('onboard.error.dob_too_old')

  return null
}
