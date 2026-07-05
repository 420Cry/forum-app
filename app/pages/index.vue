<script setup lang="ts">
import { hasAccessToken } from '~/utils/authSession'
import { postAuthPath } from '~/types/user'

const supabase = useSupabaseClient()
const { data: sessionData } = await supabase.auth.getSession()

if (!hasAccessToken(sessionData.session)) {
  await navigateTo('/auth/login', { replace: true })
}
else {
  await supabase.auth.refreshSession()
  const { refreshProfile } = useUserProfile()
  const me = await refreshProfile(true)
  await navigateTo(postAuthPath(me?.profile ?? null), { replace: true })
}
</script>

<template>
  <div />
</template>
