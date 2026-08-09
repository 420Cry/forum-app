<script setup lang="ts">
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import { useAccount } from '~/composables/accounts/useAccount'

const { t } = useI18n()
const { activeAccount, handleAvatarError } = useAccount()
</script>

<template>
  <div
    class="flex flex-col items-center bg-card border border-line rounded-lg shadow-1 px-4 pt-5 pb-4"
  >
    <AccountAvatar
      v-if="activeAccount"
      :account="activeAccount"
      :handle-avatar-error="handleAvatarError"
      size="size-16 shadow-1"
      text-class="text-base"
    />
    <div
      v-else
      class="size-16 rounded-full bg-surface-hover border border-line shrink-0"
    />

    <p class="mt-3 font-semibold text-[15px] text-ink text-center">
      {{ activeAccount?.name || t('profiles.info.unnamed') }}
    </p>
    <p class="mt-1 text-center text-[12.5px] text-ink-3 max-w-[22ch]">
      {{
        [activeAccount?.headline, activeAccount?.location]
          .filter(Boolean)
          .join(' · ')
      }}
    </p>

    <div
      v-if="activeAccount?.connections != null || activeAccount?.views != null"
      class="mt-3.5 w-full flex flex-col gap-2 pt-3 border-t border-line"
    >
      <div class="flex justify-between text-xs">
        <span class="text-ink-3">{{ t('nav.stat.profile_views') }}</span>
        <span class="text-brand font-semibold">{{
          activeAccount?.views ?? 0
        }}</span>
      </div>
      <div class="flex justify-between text-xs">
        <span class="text-ink-3">{{ t('nav.stat.connections') }}</span>
        <span class="text-brand font-semibold">{{
          activeAccount?.connections ?? 0
        }}</span>
      </div>
    </div>
  </div>
</template>
