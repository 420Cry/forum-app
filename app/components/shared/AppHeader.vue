<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import HeaderAccountMenu from '~/components/shared/HeaderAccountMenu.vue'
import LocaleSwitcher from '~/components/shared/LocaleSwitcher.vue'
import { useAccount } from '~/composables/accounts/useAccount'

const {
  showSignOut = false,
  constrained = false,
  isProtectedRoute = false,
} = defineProps<{
  showSignOut?: boolean
  /** Match auth layout content width (max-w-3xl). */
  constrained?: boolean
  isProtectedRoute?: boolean
}>()

const { t } = useI18n()
const { logout } = useSupabaseAuth()
const localePath = useLocalePath()
const { refreshProfile } = useUserProfile()
const { refreshAccounts } = useAccount()

async function handleLogout() {
  try {
    await logout()
  }
  catch {
    // Still leave the app shell even if signOut fails locally.
  }
  await navigateTo(localePath('/auth/login'), { replace: true })
}

if (isProtectedRoute) {
  await refreshProfile()
  if (import.meta.client) void refreshAccounts()
}
</script>

<template>
  <header class="relative z-40 border-b border-line bg-card">
    <div
      class="mx-auto grid h-14 w-full grid-cols-[1fr_auto] items-center gap-6 px-7"
      :class="
        constrained
          ? 'max-w-3xl'
          : isProtectedRoute
            ? 'max-w-340'
            : 'max-w-5xl'
      "
    >
      <SharedAppLogo />
      <div class="flex items-center gap-3">
        <LocaleSwitcher />
        <BaseButton
          v-if="showSignOut"
          intent="ghost"
          size="sm"
          @click="handleLogout"
        >
          {{ t('common.action.sign_out') }}
        </BaseButton>
        <HeaderAccountMenu v-if="isProtectedRoute" />
      </div>
    </div>
  </header>
</template>
