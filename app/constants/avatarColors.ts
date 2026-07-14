/**
 * Seven avatar gradient tones from the design system (`.ts-avatar.is-A…is-G`
 * in `forum-design-system/trusted-standard/trustedstandard.css`). Initials are
 * always rendered white on top of these gradients.
 */
export const avatarGradients = [
  'linear-gradient(135deg,#2C9A8E,#075056)', // A
  'linear-gradient(135deg,#6FB37C,#2D7A48)', // B
  'linear-gradient(135deg,#D49866,#A35A23)', // C
  'linear-gradient(135deg,#8E78D8,#4D2EA0)', // D
  'linear-gradient(135deg,#C36A8E,#823455)', // E
  'linear-gradient(135deg,#4E9EAF,#1F5E70)', // F
  'linear-gradient(135deg,#D89F4C,#94621A)', // G
] as const

/** Base `.ts-avatar` gradient, used when no tone can be resolved. */
export const DEFAULT_AVATAR_GRADIENT = 'linear-gradient(135deg,#0C6E6B,#053E43)'
