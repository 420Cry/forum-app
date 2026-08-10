import { isOnboardingComplete, type UserProfile } from '~/types/user'
import { stripLocalePrefix } from '~/utils/localePath'

export const AUTH_REDIRECT_QUERY = 'redirect'

function firstQueryValue(
  raw: string | string[] | null | undefined,
): string | null {
  if (raw == null) return null
  const value = Array.isArray(raw) ? raw[0] : raw
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed || null
}

/**
 * Accept only same-origin app paths (logical, locale-stripped).
 * Blocks open redirects and auth-form loops.
 */
export function sanitizeAuthRedirect(
  raw: string | string[] | null | undefined,
): string | null {
  const value = firstQueryValue(raw)
  if (!value) return null

  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  }
  catch {
    return null
  }

  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null
  if (decoded.includes('://') || decoded.includes('\\')) return null

  const pathOnly = decoded.split(/[?#]/, 1)[0] ?? ''
  const bare = stripLocalePrefix(pathOnly)
  if (!bare.startsWith('/') || bare.startsWith('//')) return null
  if (bare === '/auth' || bare.startsWith('/auth/')) return null

  return bare
}

/** Prefer a safe return path for onboarded users; otherwise onboarding. */
export function resolvePostAuthPath(
  profile: UserProfile | null | undefined,
  redirectRaw?: string | string[] | null,
): string {
  if (!isOnboardingComplete(profile)) return '/onboard'
  return sanitizeAuthRedirect(redirectRaw) ?? '/social'
}

/** Logical path (no locale) to send back after sign-in. */
export function authReturnPathFromRoute(path: string): string | null {
  return sanitizeAuthRedirect(stripLocalePrefix(path.split(/[?#]/, 1)[0] ?? path))
}
