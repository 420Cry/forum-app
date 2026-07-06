/**
 * Resolves the Supabase access token for forum-api requests.
 * Never drops a valid in-memory session when refresh fails.
 */
export function useSupabaseToken() {
  const supabase = useSupabaseClient()
  const session = useSupabaseSession()

  async function getAccessToken(forceRefresh = false): Promise<string | null> {
    const fromState = session.value?.access_token ?? null
    if (!forceRefresh && fromState) return fromState

    const { data: current } = await supabase.auth.getSession()
    const existing = current.session?.access_token ?? fromState

    // SSR and post-login: use the session we already have; refresh is client-only.
    if (!forceRefresh || import.meta.server) {
      return existing
    }

    const { data, error } = await supabase.auth.refreshSession()
    if (!error && data.session?.access_token) {
      return data.session.access_token
    }

    return existing
  }

  return { getAccessToken }
}
