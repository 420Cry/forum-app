import type { ProfileUpdatePayload } from '~/types/onboard/api'

export type SettingsProfileFields = {
  firstName: string
  lastName: string
  dateOfBirth: string
  location: string
  locationName?: string
  occupation: string
  occupationName?: string
  urlKey: string
  /** Local edit-session preview URL (may differ from committed). */
  avatarUrl: string | null
  /** Last avatar committed on the server / global profile cache. */
  committedAvatarUrl: string | null | undefined
}

/**
 * Builds PATCH /user/profile payload for settings save.
 * Avatar is included only when the edit-session draft differs from committed,
 * so header/sidebar stay unchanged until Save.
 */
export function buildSettingsProfileUpdate(
  fields: SettingsProfileFields,
): ProfileUpdatePayload {
  const payload: ProfileUpdatePayload = {
    firstName: fields.firstName,
    lastName: fields.lastName,
    dateOfBirth: fields.dateOfBirth,
    location: fields.location,
    occupation: fields.occupation,
    urlKey: fields.urlKey,
  }

  const locationName = fields.locationName?.trim()
  if (locationName) payload.locationName = locationName

  const occupationName = fields.occupationName?.trim()
  if (occupationName) payload.occupationName = occupationName

  const committed = fields.committedAvatarUrl ?? null
  if (fields.avatarUrl !== committed) {
    payload.avatarUrl = fields.avatarUrl
  }

  return payload
}
