<script setup lang="ts">
import { useCookieConsent } from '~/composables/useCookieConsent'

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  { compact: false },
)

const { t } = useI18n()
const localePath = useLocalePath()
const { openPreferences } = useCookieConsent()

const linkClass
  = 'font-semibold text-ink-3 no-underline hover:text-ink hover:underline'

const links = [
  { to: '/legal/cookies', key: 'common.action.cookie_policy' },
  { to: '/legal/privacy', key: 'common.action.privacy_policy' },
  { to: '/legal/terms', key: 'common.action.terms' },
] as const
</script>

<template>
  <nav
    :aria-label="t('common.aria.legal')"
    class="flex flex-wrap items-center justify-center gap-y-1 text-center"
    :class="compact ? 'gap-x-3 text-[12.5px]' : 'gap-x-4 text-[13px]'"
  >
    <button
      type="button"
      :class="[linkClass, 'cursor-pointer bg-transparent p-0']"
      @click="openPreferences"
    >
      {{ t('common.action.cookie_settings') }}
    </button>
    <NuxtLink
      v-for="link in links"
      :key="link.to"
      :to="localePath(link.to)"
      :class="linkClass"
    >
      {{ t(link.key) }}
    </NuxtLink>
  </nav>
</template>
