<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import LocaleSwitcher from '~/components/shared/LocaleSwitcher.vue'
import { useUserProfile } from '#imports'
import BaseIcon from './BaseIcon.vue'
import { useAccount } from '~/composables/accounts/useAccount'
import AccountSwitcher from '../home/AccountSwitcher.vue'

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

const mockUserNotiMsg = ref({
  messages: 7,
  notifications: 3,
})

const { t } = useI18n()
const { logout } = useSupabaseAuth()
const localePath = useLocalePath()
const { refreshProfile } = useUserProfile()
const { activeAccount, handleAvatarError, refreshAccounts } = useAccount()
const isShowAccountSwitcher = ref(false)
const switcherRef = ref<HTMLElement | null>(null)

const activeAccountSwitcher = () => {
  isShowAccountSwitcher.value = !isShowAccountSwitcher.value
}

async function handleLogout() {
  await logout()
  await navigateTo(localePath('/'), { replace: true })
}

if (isProtectedRoute) {
  await refreshProfile()
  if (import.meta.client) {
    void refreshAccounts()
  }
}

const onClickSwitcher = (e: MouseEvent) => {
  if (
    isShowAccountSwitcher.value
    && switcherRef.value
    && !switcherRef.value.contains(e.target as Node)
  ) {
    isShowAccountSwitcher.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickSwitcher))
onUnmounted(() => document.removeEventListener('click', onClickSwitcher))
</script>

<template>
  <header class="border-b border-line bg-card">
    <div
      class="mx-auto grid h-14 w-full grid-cols-[1fr_auto] items-center gap-6 px-7"
      :class="
        constrained
          ? 'max-w-3xl'
          : isProtectedRoute
            ? 'max-w-[1360px]'
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
        <div
          v-if="isProtectedRoute"
          class="flex items-center gap-1"
        >
          <div
            class="relative size-10 rounded-full flex items-center justify-center text-ink-3 hover:bg-surface-hover hover:text-ink cursor-pointer"
          >
            <BaseIcon
              name="message"
              size="1.25em"
            />
            <div
              class="min-w-4 h-4 px-1 absolute top-1 right-1 rounded-full bg-accent border-2 border-card flex items-center justify-center"
            >
              <p class="text-[10px] font-semibold text-white leading-none">
                {{ mockUserNotiMsg.messages }}
              </p>
            </div>
          </div>
          <div
            class="relative size-10 rounded-full flex items-center justify-center text-ink-3 hover:bg-surface-hover hover:text-ink cursor-pointer"
          >
            <BaseIcon
              name="notification"
              size="1.25em"
            />
            <div
              class="min-w-4 h-4 px-1 absolute top-1 right-1 rounded-full bg-accent border-2 border-card flex items-center justify-center"
            >
              <p class="text-[10px] font-semibold text-white leading-none">
                {{ mockUserNotiMsg.notifications }}
              </p>
            </div>
          </div>

          <div class="w-px h-6 bg-line mx-1" />

          <div
            ref="switcherRef"
            class="relative"
          >
            <button
              type="button"
              aria-haspopup="menu"
              :aria-expanded="isShowAccountSwitcher"
              class="flex gap-2 items-center h-10 pl-1 pr-3 rounded-full cursor-pointer transition ease-in-out hover:bg-surface-hover"
              :class="{ 'bg-surface-hover-2': isShowAccountSwitcher }"
              @click="activeAccountSwitcher()"
            >
              <img
                v-if="activeAccount?.avatar && !activeAccount?.avatarLoadFailed"
                :src="activeAccount.avatar"
                class="size-8 rounded-full object-cover shrink-0"
                @error="handleAvatarError(activeAccount.id)"
              />

              <div
                v-else
                class="size-8 rounded-full flex justify-center items-center shrink-0"
                :style="{ backgroundImage: activeAccount?.avatarColor }"
              >
                <span class="font-semibold text-xs text-white">
                  {{ activeAccount?.prefix }}
                </span>
              </div>

              <p class="text-[13px] font-semibold text-ink-2">
                {{ activeAccount?.name?.split(' ')[0] }}
              </p>

              <BaseIcon
                name="chevron"
                size="1.5em"
                class="text-ink-4 transition-transform"
                :class="{ 'rotate-180': isShowAccountSwitcher }"
              />
            </button>

            <div
              class="absolute top-13 right-0 transition ease-in-out"
              :class="{ hidden: !isShowAccountSwitcher }"
            >
              <AccountSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
