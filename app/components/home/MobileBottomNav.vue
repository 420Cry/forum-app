<script setup lang="ts">
import type { navigationLinkType } from '~/types/navigationType'
import { useNavigationLinks } from '~/composables/useNavLink'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import { isNavPathActive } from '~/utils/navActive'

const navigationLinks = useNavigationLinks()
const { t } = useI18n()
const route = useRoute()

const isActive = (link: navigationLinkType) =>
  isNavPathActive(route.path, link.link)
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/95 backdrop-blur-md lg:hidden"
    :aria-label="t('nav.aria.mobile')"
    style="padding-bottom: env(safe-area-inset-bottom, 0px)"
  >
    <ul class="mx-auto grid max-w-340 grid-cols-4 px-2 py-1.5">
      <li
        v-for="link in navigationLinks"
        :key="link.id"
      >
        <NuxtLink
          :to="link.link"
          class="flex flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1.5 no-underline transition-colors min-h-12"
          :class="
            isActive(link)
              ? 'text-brand'
              : 'text-ink-4 hover:text-ink-2 hover:bg-surface-hover'
          "
        >
          <BaseIcon
            :name="link.iconName"
            size="1.35em"
            :class="isActive(link) ? 'text-brand' : 'text-ink-4'"
          />
          <span
            class="text-[10.5px] font-semibold leading-tight truncate max-w-full"
          >
            {{ t(link.titleKey) }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
