export function useSupabaseToken() {
  const supabase = useSupabaseClient()

  async function getAccessToken(forceRefresh = false): Promise<string | null> {
    if (forceRefresh) {
      const { data } = await supabase.auth.refreshSession()
      return data.session?.access_token ?? null
    }
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }

  return { getAccessToken }
}
