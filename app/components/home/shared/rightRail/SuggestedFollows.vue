<script setup lang="ts">
import AccountAvatar from '~/components/shared/AccountAvatar.vue'
import BaseEmptyState from '~/components/shared/BaseEmptyState.vue'
import { useDiscovery } from '~/composables/discovery/useDiscovery'

const { t } = useI18n()
const { suggestions, isFollowed, handleFollow, handleAvatarError }
  = useDiscovery()
</script>

<template>
  <!-- Suggested to follow -->
  <div class="bg-card border border-line rounded-lg shadow-1">
    <div class="flex items-center justify-between px-4 pt-3.5 pb-1.5">
      <p class="text-[15px] font-semibold text-ink">
        {{ t('social.heading.suggested_follow') }}
      </p>
      <span class="text-xs text-brand font-semibold cursor-pointer">
        {{ t('social.action.see_all') }}
      </span>
    </div>

    <BaseEmptyState
      v-if="suggestions.length === 0"
      icon="following"
      :title="t('social.empty.suggested_title')"
      :description="t('social.empty.suggested_body')"
    />

    <div
      v-else
      class="px-2 pb-3 flex flex-col"
    >
      <div
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        class="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-surface-hover"
      >
        <AccountAvatar
          :account="suggestion"
          :handle-avatar-error="handleAvatarError"
          size="size-10 shadow-1"
        />

        <div class="flex-1 min-w-0">
          <p class="text-[13.5px] font-semibold text-ink truncate">
            {{ suggestion.name }}
          </p>
          <p class="text-xs text-ink-3 truncate">
            {{ suggestion.tags }}
          </p>
        </div>

        <button
          type="button"
          class="shrink-0 rounded-pill border-[1.4px] border-brand text-brand px-3 py-1.5 text-xs font-semibold whitespace-nowrap hover:bg-brand-tint"
          :class="{ 'bg-brand-tint': isFollowed(suggestion.id) }"
          @click="handleFollow(suggestion.id)"
        >
          {{
            isFollowed(suggestion.id)
              ? t('social.action.following')
              : `+ ${t('social.action.follow')}`
          }}
        </button>
      </div>
    </div>
  </div>
</template>
