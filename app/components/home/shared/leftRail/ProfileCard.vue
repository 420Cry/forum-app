<script setup lang="ts">
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import { useAccount } from '~/composables/accounts/useAccount'

const { activeAccount, handleAvatarError } = useAccount()
</script>

<template>
  <!-- Profile detail -->
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

    <p class="mt-3 font-semibold text-ink">
      {{ activeAccount?.name }}
    </p>
    <p class="mt-1 text-center text-xs text-ink-3">
      {{
        [activeAccount?.headline, activeAccount?.location]
          .filter(Boolean)
          .join(' · ')
      }}
    </p>

    <div
      v-if="activeAccount?.connections || activeAccount?.views"
      class="mt-3.5 w-full flex flex-col gap-2 pt-3 border-t border-line"
    >
      <div class="flex justify-between text-xs">
        <span class="text-ink-3">Profile views</span>
        <span class="text-brand font-semibold">{{
          activeAccount?.views ?? 0
        }}</span>
      </div>

      <div class="flex justify-between text-xs">
        <span class="text-ink-3">Connections</span>
        <span class="text-brand font-semibold">{{
          activeAccount?.connections ?? 0
        }}</span>
      </div>
    </div>
  </div>
</template>
