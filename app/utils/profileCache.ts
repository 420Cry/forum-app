/** True when a cached /auth/me response belongs to a different Supabase user. */
export function isProfileCacheStale(
  cachedId: string | null | undefined,
  authUserId: string,
): boolean {
  return cachedId != null && cachedId !== authUserId
}
