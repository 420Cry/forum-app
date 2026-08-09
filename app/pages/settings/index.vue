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
  {
    to: '/find',
    titleKey: 'find.heading.title',
    descKey: 'find.info.subtitle',
  },
  {
    to: '/following',
    titleKey: 'following.heading.title',
    descKey: 'following.info.subtitle',
  },
] as const
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-7 py-6">
    <h1 class="text-xl font-semibold text-ink mb-1">
      {{ t('settings.heading.settings') }}
    </h1>
    <p class="text-sm text-ink-3 mb-6">
      {{ t('settings.info.subtitle') }}
    </p>

    <div class="flex flex-col gap-2">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="localePath(link.to)"
        class="block bg-card border border-line rounded-md px-5 py-4 hover:bg-surface-hover no-underline"
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
