<script setup lang="ts">
definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const localePath = useLocalePath()

useHead({
  title: () => t('common.heading.privacy_policy'),
})
</script>

<template>
  <article class="mx-auto max-w-prose pb-8">
    <h1 class="text-[22px] font-bold tracking-[-0.02em] text-ink">
      {{ t('common.heading.privacy_policy') }}
    </h1>
    <p class="mt-3 text-base text-ink-2">
      {{ t('common.info.privacy_intro') }}
    </p>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.privacy_who') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.privacy_who') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.privacy_data') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.privacy_data') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.privacy_processors') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.privacy_processors') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.privacy_cookies') }}
      </h2>
      <i18n-t
        keypath="common.info.privacy_cookies"
        tag="p"
        class="mt-2 text-base text-ink-2"
      >
        <template #policy>
          <NuxtLink
            :to="localePath('/legal/cookies')"
            class="font-semibold text-brand no-underline hover:underline"
          >
            {{ t('common.action.cookie_policy') }}
          </NuxtLink>
        </template>
      </i18n-t>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.privacy_rights') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.privacy_rights') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.privacy_contact') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.privacy_contact') }}
      </p>
    </section>
  </article>
</template>
