<script setup lang="ts">
import type { navigationLinkType } from '~/types/navigationType'
import { useNavigationLinks } from '~/composables/useNavLink'
import BaseIcon from '@/components/shared/BaseIcon.vue'

const navigationLinks = useNavigationLinks()
const { t } = useI18n()
const route = useRoute()

// Links are already locale-aware from the composable, so compare against the current path directly.
const isActive = (link: navigationLinkType) => link.link === route.path
</script>

<template>
  <nav
    class="w-full bg-card border border-line rounded-lg shadow-1 p-1.5 flex flex-col"
  >
    <NuxtLink
      v-for="link in navigationLinks"
      :key="link.id"
      :to="link.link"
      class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-ink-2 hover:bg-surface-hover transition-colors"
      :class="{ 'bg-brand-tint text-brand': isActive(link) }"
    >
      <BaseIcon
        :name="link.iconName"
        size="1.25em"
        :class="isActive(link) ? 'text-brand' : 'text-ink-4'"
      />
      <span>{{ t(link.titleKey) }}</span>
      <span
        v-if="link.count"
        class="ml-auto text-xs font-semibold rounded-pill px-1.5 py-0.5"
        :class="
          isActive(link) ? 'bg-brand text-white' : 'bg-surface-hover text-ink-4'
        "
      >
        {{ link.count }}
      </span>
    </NuxtLink>
  </nav>
</template>
