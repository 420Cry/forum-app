<script setup lang="ts">
import { useSupabaseAuth } from '~/composables'

const { refreshUser } = useSupabaseAuth()
onMounted(async () => {
  const supabase = useSupabaseClient()
  const nuxtSession = useSupabaseSession()
  const { data } = await supabase.auth.getSession()
  const session = data.session ?? nuxtSession.value
  if (session?.access_token) {
    void refreshUser()
  }
})

useHead({
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ],
})
</script>

<template>
  <div class="min-h-screen font-sans antialiased">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppToast />
  </div>
</template>
