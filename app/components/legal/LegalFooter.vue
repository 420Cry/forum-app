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
</script>

<template>
  <nav
    :aria-label="t('common.aria.legal')"
    :class="
      compact
        ? 'flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[12.5px]'
        : 'flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-[13px]'
    "
  >
    <button
      type="button"
      :class="[linkClass, 'cursor-pointer bg-transparent p-0']"
      @click="openPreferences"
    >
      {{ t('common.action.cookie_settings') }}
    </button>
    <NuxtLink
      :to="localePath('/legal/cookies')"
      :class="linkClass"
    >
      {{ t('common.action.cookie_policy') }}
    </NuxtLink>
    <NuxtLink
      :to="localePath('/legal/privacy')"
      :class="linkClass"
    >
      {{ t('common.action.privacy_policy') }}
    </NuxtLink>
    <NuxtLink
      :to="localePath('/legal/terms')"
      :class="linkClass"
    >
      {{ t('common.action.terms') }}
    </NuxtLink>
  </nav>
</template>
