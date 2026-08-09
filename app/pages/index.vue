<script setup lang="ts">
import { postAuthPath } from '~/types/user'

const localePath = useLocalePath()
const supabase = useSupabaseClient()
const nuxtSession = useSupabaseSession()
const { data: sessionData } = await supabase.auth.getSession()
// Client: trust getSession() only. Coalescing to useSupabaseSession() after
// signOut can revive a stale token and bounce logout back to /social.
const session = import.meta.server
  ? (sessionData.session ?? nuxtSession.value)
  : sessionData.session

const hasSession = !!session?.access_token

if (!hasSession) {
  await navigateTo(localePath('/auth/login'), { replace: true })
}
else {
  const { refreshProfile } = useUserProfile()
  const me = await refreshProfile(false)
  await navigateTo(localePath(postAuthPath(me?.profile ?? null)), {
    replace: true,
  })
}
</script>

<template>
  <div />
</template>
