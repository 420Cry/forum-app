<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import HeaderMessagesLink from '~/components/chat/HeaderMessagesLink.vue'
import HeaderAccountMenu from '~/components/shared/HeaderAccountMenu.vue'
import LocaleSwitcher from '~/components/shared/LocaleSwitcher.vue'
import { useAccount } from '~/composables/accounts/useAccount'
import {
  AUTH_REDIRECT_QUERY,
  authReturnPathFromRoute,
} from '~/utils/authRedirect'

const props = withDefaults(
  defineProps<{
    showSignOut?: boolean
    /** Match auth layout content width (max-w-3xl). */
    constrained?: boolean
    isProtectedRoute?: boolean
    /** Sign in / Create account for public pages viewed while signed out. */
    showGuestAuth?: boolean
  }>(),
  {
    showSignOut: false,
    constrained: false,
    isProtectedRoute: false,
    showGuestAuth: false,
  },
)

const { t } = useI18n()
const { logout } = useSupabaseAuth()
const localePath = useLocalePath()
const route = useRoute()
const { refreshProfile, unauthorized } = useUserProfile()
const { refreshAccounts } = useAccount()
const session = useSupabaseSession()

function guestAuthTo(path: '/auth/login' | '/auth/register') {
  const redirect = authReturnPathFromRoute(route.fullPath)
  return {
    path: localePath(path),
    query: redirect ? { [AUTH_REDIRECT_QUERY]: redirect } : undefined,
  }
}

async function handleLogout() {
  try {
    await logout()
  }
  catch {
    // Still leave the app shell even if signOut fails locally.
  }
  await navigateTo(localePath('/auth/login'), { replace: true })
}

async function syncProtectedShell() {
  if (!props.isProtectedRoute) return
  // Skip when there is no JWT — avoids /auth/me 401 storms on public pages.
  if (!session.value?.access_token) return
  if (unauthorized.value) return
  await refreshProfile()
  if (unauthorized.value) return
  if (import.meta.client) void refreshAccounts()
}

// Re-run when the layout flips guest ↔ signed-in (prop can change after setup).
watch(
  () => [props.isProtectedRoute, session.value?.access_token] as const,
  () => {
    void syncProtectedShell()
  },
  { immediate: true },
)
</script>

<template>
  <header class="relative z-40 border-b border-line bg-card">
    <div
      class="mx-auto grid h-14 w-full grid-cols-[1fr_auto] items-center gap-3 px-4 sm:gap-6 sm:px-7"
      :class="
        constrained
          ? 'max-w-3xl'
          : isProtectedRoute || showGuestAuth
            ? 'max-w-340'
            : 'max-w-5xl'
      "
    >
      <SharedAppLogo />
      <div class="flex items-center gap-3">
        <LocaleSwitcher />
        <HeaderMessagesLink v-if="isProtectedRoute" />
        <span
          v-if="isProtectedRoute"
          class="hidden h-6 w-px bg-line sm:block"
          aria-hidden="true"
        />
        <BaseButton
          v-if="showSignOut"
          intent="ghost"
          size="sm"
          @click="handleLogout"
        >
          {{ t('common.action.sign_out') }}
        </BaseButton>
        <template v-if="showGuestAuth">
          <BaseButton
            intent="ghost"
            size="sm"
            @click="navigateTo(guestAuthTo('/auth/login'))"
          >
            {{ t('auth.action.sign_in') }}
          </BaseButton>
          <BaseButton
            intent="primary"
            size="sm"
            @click="navigateTo(guestAuthTo('/auth/register'))"
          >
            {{ t('auth.action.create_account') }}
          </BaseButton>
        </template>
        <HeaderAccountMenu v-if="isProtectedRoute" />
      </div>
    </div>
  </header>
</template>
