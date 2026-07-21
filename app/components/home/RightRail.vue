<script setup lang="ts">
import { useDiscovery } from '~/composables/discovery/useDiscovery'

const { t } = useI18n()
const { suggestions, trending, isFollowed, handleFollow, handleAvatarError }
  = useDiscovery()
</script>

<template>
  <!-- right rail content -->
  <div class="flex flex-col gap-3">
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

      <div class="px-2 pb-3 flex flex-col">
        <div
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          class="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-surface-hover"
        >
          <img
            v-if="suggestion.avatar && !suggestion.avatarLoadFailed"
            :src="suggestion.avatar"
            class="size-10 rounded-full object-cover shrink-0 shadow-1"
            @error="handleAvatarError(suggestion.name)"
          />

          <div
            v-else
            class="size-10 rounded-full flex justify-center items-center shrink-0 shadow-1"
            :style="{ backgroundImage: suggestion.avatarColor }"
          >
            <span class="text-sm font-semibold text-white">
              {{ suggestion.prefix }}
            </span>
          </div>

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

    <!-- Trending now -->
    <div class="bg-card border border-line rounded-lg shadow-1">
      <div class="px-4 pt-3.5 pb-1.5">
        <p class="text-[15px] font-semibold text-ink">
          {{ t('social.heading.trending') }}
        </p>
      </div>

      <div>
        <div
          v-for="(item, index) in trending"
          :key="item.id"
          class="grid grid-cols-[18px_1fr_auto] gap-2.5 items-start px-4 py-3 border-t border-line first:border-t-0 hover:bg-surface-hover cursor-pointer"
        >
          <span class="text-xs text-ink-4 font-semibold pt-px">
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <div class="min-w-0">
            <p class="text-[13.5px] font-semibold text-ink">
              {{ item.title }}
            </p>
            <p class="text-xs text-ink-3 mt-0.5">
              {{ item.subtitle }}
            </p>
          </div>

          <span
            class="rounded-sm bg-accent-soft text-accent-text uppercase tracking-wide text-[9.5px] font-semibold px-1.5 py-1 whitespace-nowrap"
          >
            {{ t(`social.badge.${item.badge}`) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
