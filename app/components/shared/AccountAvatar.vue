<script setup lang="ts">
import type { AccountSummaryView } from '~/types/profile'

withDefaults(
  defineProps<{
    account: Pick<
      AccountSummaryView,
      'id' | 'avatar' | 'avatarLoadFailed' | 'avatarColor' | 'prefix'
    >
    handleAvatarError: (id: string) => void
    size?: string
    textClass?: string
  }>(),
  {
    size: 'size-10',
    textClass: 'text-sm',
  },
)
</script>

<template>
  <img
    v-if="account.avatar && !account.avatarLoadFailed"
    :src="account.avatar"
    class="rounded-full object-cover shrink-0"
    :class="size"
    @error="handleAvatarError(account.id)"
  />

  <div
    v-else
    class="rounded-full flex justify-center items-center shrink-0"
    :class="size"
    :style="{ backgroundImage: account.avatarColor }"
  >
    <span
      class="font-semibold text-white"
      :class="textClass"
    >
      {{ account.prefix }}
    </span>
  </div>
</template>
