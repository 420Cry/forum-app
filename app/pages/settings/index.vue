<script setup lang="ts">
definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const localePath = useLocalePath()

const links = [
  {
    to: '/settings/profile',
    titleKey: 'settings.heading.edit_profile',
    descKey: 'settings.info.edit_profile',
  },
  {
    to: '/profiles/startup/edit',
    titleKey: 'profiles.heading.startup_edit',
    descKey: 'profiles.info.startup_edit',
  },
  {
    to: '/profiles/investor/edit',
    titleKey: 'profiles.heading.investor_edit',
    descKey: 'profiles.info.investor_edit',
  },
] as const
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="bg-card border border-line rounded-md shadow-1 px-5 py-4">
      <h1 class="text-[15px] font-semibold text-ink">
        {{ t('settings.heading.settings') }}
      </h1>
      <p class="text-[12.5px] text-ink-4 mt-0.5">
        {{ t('settings.info.subtitle') }}
      </p>
    </div>

    <div class="bg-card border border-line rounded-md shadow-1 overflow-hidden">
      <NuxtLink
        v-for="(link, index) in links"
        :key="link.to"
        :to="localePath(link.to)"
        class="block px-5 py-4 hover:bg-surface-hover no-underline"
        :class="{ 'border-t border-line': index > 0 }"
      >
        <p class="font-semibold text-[14px] text-ink">
          {{ t(link.titleKey) }}
        </p>
        <p class="text-sm text-ink-3 mt-1">
          {{ t(link.descKey) }}
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
