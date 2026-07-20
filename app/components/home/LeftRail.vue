<script setup lang="ts">
import { useAccount } from '~/composables/accounts/useAccount'
import NavigationTabs from '../shared/NavigationTabs.vue'

const { activeAccount, handleAvatarError } = useAccount()
</script>

<template>
  <!-- left rail content -->
  <div class="flex flex-col gap-3">
    <!-- Profile detail -->
    <div
      class="flex flex-col items-center gap-2 bg-white border border-gray-300 py-4"
    >
      <div
        class="flex flex-col items-center gap-2 border-b border-gray-300 pb-4 w-full"
      >
        <img
          v-if="activeAccount?.avatar && !activeAccount?.avatarLoadFailed"
          :src="activeAccount.avatar"
          class="size-12 rounded-full object-cover shrink-0"
          @error="handleAvatarError(activeAccount.name)"
        />

        <div
          v-else
          class="size-12 rounded-full flex justify-center items-center shrink-0"
          :style="{ backgroundImage: activeAccount?.avatarColor }"
        >
          <span class="font-semibold text-md text-white">
            {{ activeAccount?.prefix }}
          </span>
        </div>
        <p class="font-bold">
          {{ activeAccount?.name }}
        </p>
        <p class="text-sm">
          {{ activeAccount?.subtitle }}
        </p>
        <p class="text-sm">
          {{ activeAccount?.location }}
        </p>
      </div>

      <div class="mt-2 w-full flex flex-col gap-2">
        <div class="flex justify-around">
          <p>Profile views</p>
          <p>{{ activeAccount?.views }}</p>
        </div>

        <div
          v-if="activeAccount?.connections"
          class="flex justify-around"
        >
          <p>Connections</p>
          <p>{{ activeAccount?.connections }}</p>
        </div>
      </div>
    </div>

    <!-- navigation -->
    <NavigationTabs />
  </div>
</template>
