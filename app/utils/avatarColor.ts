import {
  avatarGradients,
  DEFAULT_AVATAR_GRADIENT,
} from '~/constants/avatarColors'

/**
 * Pick an avatar gradient deterministically from a stable key (e.g. user id or
 * name), so the same account always renders the same tone across components.
 * Returns a CSS gradient string to bind via `:style="{ backgroundImage }"`.
 */
export const getAvatarColor = (key: string): string => {
  if (!avatarGradients.length) return DEFAULT_AVATAR_GRADIENT

  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  }

  const index = Math.abs(hash) % avatarGradients.length
  return avatarGradients[index] ?? DEFAULT_AVATAR_GRADIENT
}
