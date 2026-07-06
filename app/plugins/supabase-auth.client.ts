import type { User as SupabaseUser } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const supabase = useSupabaseClient()
  const refreshedUser = useState<SupabaseUser | null>(
    'supabase-refreshed-user',
    () => null,
  )

  supabase.auth.onAuthStateChange(async (event) => {
    if (
      event === 'SIGNED_IN'
      || event === 'USER_UPDATED'
      || event === 'TOKEN_REFRESHED'
    ) {
      const { data } = await supabase.auth.getUser()
      refreshedUser.value = data.user
    }
    if (event === 'SIGNED_OUT') {
      refreshedUser.value = null
    }
  })
})
