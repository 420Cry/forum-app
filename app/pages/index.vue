<script setup lang="ts">
import { useSupabaseAuth } from '~/composables/auth/useSupabaseAuth'
import { postAuthPath } from '~/types/user'
import { isEmailVerified } from '~/utils/authSession'

definePageMeta({ access: 'public' })

const localePath = useLocalePath()
const supabase = useSupabaseClient()
const nuxtSession = useSupabaseSession()
const { refreshUser } = useSupabaseAuth()
const { data: sessionData } = await supabase.auth.getSession()
// Client: trust getSession() only. Coalescing to useSupabaseSession() after
// signOut can revive a stale token and bounce logout back to /social.
const session = import.meta.server
  ? (sessionData.session ?? nuxtSession.value)
  : sessionData.session

const hasSession = !!session?.access_token
const verified = hasSession
  ? (import.meta.client
      ? await refreshUser()
      : isEmailVerified(session?.user))
  : false

if (!hasSession || !verified) {
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
