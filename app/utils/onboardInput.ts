/** Letters, spaces, hyphens, apostrophes — no digits or symbols. */
export const PERSON_NAME_RE = /^[\p{L}\s'-]+$/u

/** Whole numbers only (age input before range check). */
export const AGE_DIGITS_RE = /^\d+$/

/** Location / occupation: letters, numbers, spaces, common punctuation. */
export const LOCATION_OCCUPATION_RE = /^[\p{L}\p{N}\s.,'/-]+$/u

export function sanitizePersonName(value: string): string {
  return value.replace(/[^\p{L}\s'-]/gu, '')
}

export function sanitizeAgeInput(value: string): string {
  return value.replace(/\D/g, '')
}
