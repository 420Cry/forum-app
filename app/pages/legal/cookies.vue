<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import { useCookieConsent } from '~/composables/useCookieConsent'
import { COOKIE_INVENTORY } from '~/utils/cookieConsent'

definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const { openPreferences } = useCookieConsent()

useHead({
  title: () => t('common.heading.cookie_policy'),
})
</script>

<template>
  <article class="mx-auto max-w-prose pb-8">
    <h1 class="text-[22px] font-bold tracking-[-0.02em] text-ink">
      {{ t('common.heading.cookie_policy') }}
    </h1>

    <div class="mt-5">
      <BaseButton
        intent="secondary"
        size="sm"
        @click="openPreferences"
      >
        {{ t('common.action.cookie_settings') }}
      </BaseButton>
    </div>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.cookie_policy_about') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.cookie_policy_about') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.cookie_controller') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.cookie_controller') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.what_are_cookies') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.what_are_cookies') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.how_we_use_cookies') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.how_we_use_cookies') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.cookie_necessary') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.cookie_necessary_policy') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.cookie_optional') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.cookie_optional_policy') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.cookies_we_use') }}
      </h2>
      <div class="mt-3 overflow-x-auto rounded-md border border-line bg-card shadow-1">
        <table class="w-full min-w-160 border-collapse text-left text-base">
          <thead>
            <tr class="border-b border-line bg-surface-hover">
              <th class="px-4 py-2.5 text-[13px] font-semibold text-ink-3">
                {{ t('common.label.cookie_name') }}
              </th>
              <th class="px-4 py-2.5 text-[13px] font-semibold text-ink-3">
                {{ t('common.label.cookie_provider') }}
              </th>
              <th class="px-4 py-2.5 text-[13px] font-semibold text-ink-3">
                {{ t('common.label.cookie_duration') }}
              </th>
              <th class="px-4 py-2.5 text-[13px] font-semibold text-ink-3">
                {{ t('common.label.cookie_purpose') }}
              </th>
              <th class="px-4 py-2.5 text-[13px] font-semibold text-ink-3">
                {{ t('common.label.cookie_category') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cookie in COOKIE_INVENTORY"
              :key="cookie.nameKey"
              class="border-b border-line last:border-b-0"
            >
              <td class="px-4 py-3 align-top font-medium whitespace-nowrap text-ink">
                {{ t(cookie.nameKey) }}
              </td>
              <td class="px-4 py-3 align-top text-ink-2">
                {{ t(cookie.providerKey) }}
              </td>
              <td class="px-4 py-3 align-top text-ink-2">
                {{ t(cookie.durationKey) }}
              </td>
              <td class="px-4 py-3 align-top text-ink-2">
                {{ t(cookie.purposeKey) }}
              </td>
              <td class="px-4 py-3 align-top text-ink-2">
                {{ t('common.heading.cookie_necessary') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.cookie_change_preferences') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.cookie_change_preferences') }}
      </p>
    </section>

    <section class="mt-8">
      <h2 class="text-[16px] font-semibold text-ink">
        {{ t('common.heading.cookie_policy_changes') }}
      </h2>
      <p class="mt-2 text-base text-ink-2">
        {{ t('common.info.cookie_policy_changes') }}
      </p>
    </section>
  </article>
</template>
