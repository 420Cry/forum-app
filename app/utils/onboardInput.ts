/** Letters, spaces, hyphens, apostrophes — no digits or symbols. */
export const PERSON_NAME_RE = /^[\p{L}\s'-]+$/u

/** Catalog tag keys from the API (location, occupation, industry). */
export const TAG_KEY_RE = /^[a-z0-9]+(?:[_-][a-z0-9]+)*$/

export function sanitizePersonName(value: string): string {
  return value.replace(/[^\p{L}\s'-]/gu, '')
}
