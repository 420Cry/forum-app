<script setup lang="ts">
import { useAccount } from '~/composables/accounts/useAccount'
import BaseIcon from '../shared/BaseIcon.vue'

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { logout } = useSupabaseAuth()

const handleLogout = async () => {
  try {
    await logout()
  }
  catch {
    // Still leave the app shell even if signOut fails locally.
  }
  await navigateTo(localePath('/auth/login'), { replace: true })
}

const {
  profileExample,
  handleActive,
  handleAvatarError,
  activeAccountId,
  refreshAccounts,
} = useAccount()

/** Personal account only — org pages are paused for now. */
const personalAccounts = computed(() =>
  profileExample.value.filter(a => a.accountType === 'user'),
)

watch(
  personalAccounts,
  (list) => {
    if (!list.some(a => a.id === activeAccountId.value)) {
      activeAccountId.value = list[0]?.id ?? null
    }
  },
  { immediate: true },
)

onMounted(() => {
  void refreshAccounts()
})

async function openProfile(accountId: string, href: string) {
  handleActive(accountId)
  emit('close')
  await navigateTo(localePath(href))
}

function onSettingsClick() {
  emit('close')
}
</script>

<template>
  <div
    role="menu"
    class="w-75 rounded-md border border-line bg-card p-1.5 shadow-pop"
  >
    <p
      class="text-[11px] font-semibold tracking-[0.04em] uppercase text-ink-4 px-2.5 pt-2 pb-1.5"
    >
      {{ t('social.account.signed_in_as') }}
    </p>

    <div class="flex flex-col gap-1">
      <button
        v-for="account in personalAccounts"
        :key="account.id"
        type="button"
        role="menuitem"
        class="flex w-full cursor-pointer items-center gap-3 rounded-sm px-2.5 py-2.75 text-left hover:bg-surface-hover"
        :class="{ 'bg-brand-tint': account.id === activeAccountId }"
        @click="openProfile(account.id, account.href)"
      >
        <img
          v-if="account.avatar && !account.avatarLoadFailed"
          :src="account.avatar"
          class="size-10 shrink-0 rounded-full object-cover"
          @error="handleAvatarError(account.id)"
        />
        <div
          v-else
          class="flex size-10 shrink-0 items-center justify-center rounded-full"
          :style="{ backgroundImage: account.avatarColor }"
        >
          <span class="text-sm font-semibold text-white">
            {{ account.prefix }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <p class="text-[13.5px] font-semibold text-ink">
            {{ account.name }}
          </p>
          <p class="mt-0.75 truncate whitespace-nowrap text-xs text-ink-3">
            {{ account.subtitle }}
          </p>
        </div>

        <BaseIcon
          v-if="account.id === activeAccountId"
          name="check"
          size="1.5em"
          class="shrink-0 text-brand"
        />
      </button>
    </div>

    <hr class="mx-1 my-1.5 border-line">

    <NuxtLink
      :to="localePath('/settings')"
      role="menuitem"
      class="flex w-full cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2.25 no-underline hover:bg-surface-hover"
      @click="onSettingsClick"
    >
      <div
        class="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-hover"
      >
        <BaseIcon
          name="settings"
          class="text-ink-3"
          size="18"
        />
      </div>
      <span class="text-[13.5px] font-semibold text-ink-2">
        {{ t('settings.heading.settings') }}
      </span>
    </NuxtLink>

    <hr class="mx-1 my-1.5 border-line">

    <div class="px-3 pt-1.5 pb-2">
      <span
        class="cursor-pointer text-xs font-medium text-ink-3 transition-colors hover:text-ink"
        @click="handleLogout"
      >
        {{ t('common.action.sign_out') }}
      </span>
    </div>
  </div>
</template>
