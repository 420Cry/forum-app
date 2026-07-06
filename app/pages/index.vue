<script setup lang="ts">
import { postAuthPath } from '~/types/user'

const localePath = useLocalePath()
const supabase = useSupabaseClient()
const nuxtSession = useSupabaseSession()
const { data: sessionData } = await supabase.auth.getSession()
const session = sessionData.session ?? nuxtSession.value

const hasSession = !!(session?.access_token)

if (!hasSession) {
  await navigateTo(localePath('/auth/login'), { replace: true })
}
else {
  const { refreshProfile } = useUserProfile()
  const me = await refreshProfile(false)
  await navigateTo(localePath(postAuthPath(me?.profile ?? null)), { replace: true })
}
</script>

<template>
  <div />
</template>
