<script setup lang="ts">
import LeftRail from '~/components/home/shared/LeftRail.vue'
import MobileBottomNav from '~/components/home/MobileBottomNav.vue'

const user = useSupabaseUser()
const session = useSupabaseSession()
const { unauthorized } = useUserProfile()

/** Public pages (/u/…, /startup/…, /investor/…) reuse this layout; guests get chrome without app nav. */
const isSignedIn = computed(
  () =>
    !unauthorized.value
    && !!(user.value?.id || session.value?.access_token),
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader
      :is-protected-route="isSignedIn"
      :show-guest-auth="!isSignedIn"
    />
    <div
      class="mx-auto grid w-full max-w-340 items-start gap-4 p-4  sm:gap-6 sm:px-7 sm:py-6"
      :class="
        isSignedIn
          ? 'grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]'
          : 'grid-cols-1'
      "
    >
      <aside
        v-if="isSignedIn"
        class="hidden lg:block sticky top-6"
      >
        <LeftRail />
      </aside>
      <main
        class="min-w-0"
        :class="isSignedIn ? 'pb-20 lg:pb-0' : undefined"
      >
        <slot />
      </main>
    </div>
    <MobileBottomNav v-if="isSignedIn" />
  </div>
</template>
