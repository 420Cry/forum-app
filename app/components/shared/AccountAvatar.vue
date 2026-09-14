<script setup lang="ts">
import type { AccountSummaryView } from '~/types/profile'
import type { SuggestionView } from '~/types/discoveryType'
import type { PostAuthor } from '~/types/post'

// Anything the avatar can render: accounts, follow suggestions, or post authors.
// All share the avatar/color/prefix/error fields the avatar needs.
type AvatarSource = AccountSummaryView | SuggestionView | PostAuthor

withDefaults(
  defineProps<{
    account: AvatarSource
    handleAvatarError: (id: string) => void
    // Tailwind size utility for the avatar (e.g. "size-16"); text scales with it.
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
