<script setup lang="ts">
import { useAccount } from '~/composables/accounts/useAccount'
import NavigationTabs from '../shared/NavigationTabs.vue'

const { t } = useI18n()
const { activeAccount, handleAvatarError, isUserPaid } = useAccount()
</script>

<template>
  <!-- left rail content -->
  <div class="flex flex-col gap-3">
    <!-- Profile detail -->
    <div
      class="flex flex-col items-center bg-card border border-line rounded-lg shadow-1 px-4 pt-5 pb-4"
    >
      <img
        v-if="activeAccount?.avatar && !activeAccount?.avatarLoadFailed"
        :src="activeAccount.avatar"
        class="size-16 rounded-full object-cover shrink-0 shadow-1"
        @error="handleAvatarError(activeAccount.name)"
      />

      <div
        v-else
        class="size-16 rounded-full flex justify-center items-center shrink-0 shadow-1"
        :style="{ backgroundImage: activeAccount?.avatarColor }"
      >
        <span class="font-semibold text-white">
          {{ activeAccount?.prefix }}
        </span>
      </div>

      <p class="mt-3 font-semibold text-ink">
        {{ activeAccount?.name }}
      </p>
      <p class="mt-1 text-center text-xs text-ink-3">
        {{
          [activeAccount?.subtitle, activeAccount?.location]
            .filter(Boolean)
            .join(' · ')
        }}
      </p>

      <div class="mt-3.5 w-full flex flex-col gap-2 pt-3 border-t border-line">
        <div class="flex justify-between text-xs">
          <span class="text-ink-3">Profile views</span>
          <span class="text-brand font-semibold">{{
            activeAccount?.views
          }}</span>
        </div>

        <div
          v-if="activeAccount?.connections"
          class="flex justify-between text-xs"
        >
          <span class="text-ink-3">Connections</span>
          <span class="text-brand font-semibold">{{
            activeAccount?.connections
          }}</span>
        </div>
      </div>
    </div>

    <!-- navigation -->
    <NavigationTabs />

    <!-- member recommendation -->
    <div
      v-if="!isUserPaid"
      class="w-full bg-card py-3.5 px-4 border border-line rounded-lg shadow-1 flex flex-col gap-1"
    >
      <p class="font-semibold text-sm text-ink">
        {{ t('social.heading.become_member') }}
      </p>
      <p class="text-xs/relaxed text-ink-3 ">
        {{ t('social.info.become_member') }}
      </p>
      <p class="mt-1 text-xs text-brand font-semibold">
        {{ t('social.action.learn_more') }} →
      </p>
    </div>
  </div>
</template>
