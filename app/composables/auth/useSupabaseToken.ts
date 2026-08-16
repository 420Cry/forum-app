import { isTokenExpiring } from '~/utils/authSession'

/** Shared across callers so parallel requests trigger one refresh, not a storm. */
let refreshInFlight: Promise<string | null> | null = null

/**
 * Resolves the Supabase access token for forum-api requests.
 * Refreshes when the token is expired or close to it, and never drops a valid
 * in-memory session when refresh fails.
 */
export function useSupabaseToken() {
  const supabase = useSupabaseClient()
  const session = useSupabaseSession()

  function refreshOnce(fallback: string | null): Promise<string | null> {
    if (refreshInFlight) return refreshInFlight

    const pending = supabase.auth.refreshSession().then(({ data, error }) =>
      !error && data.session?.access_token
        ? data.session.access_token
        : fallback,
    )
    refreshInFlight = pending
    void pending
      .catch(() => null)
      .finally(() => {
        if (refreshInFlight === pending) refreshInFlight = null
      })

    return pending
  }

  async function getAccessToken(forceRefresh = false): Promise<string | null> {
    const fromState = session.value?.access_token ?? null
    const stateExpiring = isTokenExpiring(session.value?.expires_at)
    if (!forceRefresh && fromState && !stateExpiring) return fromState

    const { data: current } = await supabase.auth.getSession()
    const existing = current.session?.access_token ?? fromState
    const expiring = current.session
      ? isTokenExpiring(current.session.expires_at)
      : stateExpiring

    // Refresh is client-only: SSR reads cookies it cannot rewrite.
    if (import.meta.server) return existing
    if (!forceRefresh && !expiring) return existing

    return refreshOnce(existing)
  }

  return { getAccessToken }
}
