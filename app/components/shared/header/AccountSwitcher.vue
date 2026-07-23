<script setup lang="ts">
import { useAccount } from '~/composables/accounts/useAccount'
import AccountAvatar from '@/components/shared/AccountAvatar.vue'
import BaseIcon from '@/components/shared/BaseIcon.vue'

const { t } = useI18n()

// Example implementation for account switcher. In reality, it should fetch from /auth/me and extract the profile

const localePath = useLocalePath()
const { logout } = useSupabaseAuth()

const handleLogout = async () => {
  await logout()
  await navigateTo(localePath('/'), { replace: true })
}

const { profileExample, handleActive, handleAvatarError, activeAccountId }
  = useAccount()
</script>

<template>
  <div
    role="menu"
    class="w-[300px] bg-card border border-line shadow-pop rounded-md p-1.5"
  >
    <p
      class="text-[11px] font-semibold tracking-[0.04em] uppercase text-ink-4 px-2.5 pt-2 pb-1.5"
    >
      {{ t('social.account.signed_in_as') }}
    </p>

    <div class="flex flex-col gap-1">
      <button
        v-for="account in profileExample"
        :key="account.name"
        type="button"
        role="menuitem"
        class="flex items-center gap-3 px-2.5 py-[11px] rounded-sm cursor-pointer text-left w-full hover:bg-surface-hover"
        :class="{ 'bg-brand-tint': account.id === activeAccountId }"
        @click="handleActive(account.id)"
      >
        <AccountAvatar
          :account="account"
          :handle-avatar-error="handleAvatarError"
        />

        <div class="flex-1 min-w-0">
          <p class="font-semibold text-[13.5px] text-ink">
            {{ account.name }}
          </p>
          <p class="text-xs text-ink-3 mt-[3px] truncate whitespace-nowrap">
            {{ account.headline }}
          </p>
        </div>

        <BaseIcon
          v-if="account.id === activeAccountId"
          name="check"
          size="1.5em"
          class="text-brand shrink-0"
        />
      </button>
    </div>

    <hr class="border-line my-1.5 mx-1" />

    <button
      class="flex items-center gap-2.5 w-full px-2.5 py-[9px] rounded-sm hover:bg-brand-tint cursor-pointer"
    >
      <div
        class="size-8 rounded-full bg-brand-tint flex justify-center items-center shrink-0"
      >
        <BaseIcon
          name="home"
          class="text-brand"
          size="18"
        />
      </div>
      <span class="text-brand font-semibold text-[13.5px]">
        {{ t('social.account.add_startup_page') }}
      </span>
    </button>

    <hr class="border-line my-1.5 mx-1" />

    <div class="px-3 pt-1.5 pb-2">
      <span
        class="text-xs font-medium text-ink-3 hover:text-ink cursor-pointer transition-colors"
        @click="handleLogout"
      >
        {{ t('common.action.sign_out') }}
      </span>
    </div>
  </div>
</template>
