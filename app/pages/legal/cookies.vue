<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import LegalPage from '~/components/legal/LegalPage.vue'
import LegalSection from '~/components/legal/LegalSection.vue'
import { useCookieConsent } from '~/composables/useCookieConsent'
import { COOKIE_INVENTORY } from '~/utils/cookieConsent'

definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const { openPreferences } = useCookieConsent()

const beforeTable = [
  ['common.heading.cookie_policy_about', 'common.info.cookie_policy_about'],
  ['common.heading.cookie_controller', 'common.info.cookie_controller'],
  ['common.heading.what_are_cookies', 'common.info.what_are_cookies'],
  ['common.heading.how_we_use_cookies', 'common.info.how_we_use_cookies'],
  ['common.heading.cookie_necessary', 'common.info.cookie_necessary_policy'],
  ['common.heading.cookie_optional', 'common.info.cookie_optional_policy'],
] as const

const afterTable = [
  ['common.heading.cookie_change_preferences', 'common.info.cookie_change_preferences'],
  ['common.heading.cookie_policy_changes', 'common.info.cookie_policy_changes'],
] as const

const columns = [
  'common.label.cookie_name',
  'common.label.cookie_duration',
  'common.label.cookie_purpose',
  'common.label.cookie_category',
] as const
</script>

<template>
  <LegalPage title="common.heading.cookie_policy">
    <div class="mt-5">
      <BaseButton
        intent="secondary"
        size="sm"
        @click="openPreferences"
      >
        {{ t('common.action.cookie_settings') }}
      </BaseButton>
    </div>

    <LegalSection
      v-for="[heading, info] in beforeTable"
      :key="heading"
      :heading="heading"
      :info="info"
    />

    <LegalSection heading="common.heading.cookies_we_use">
      <div class="mt-3 overflow-x-auto rounded-md border border-line bg-card shadow-1">
        <table class="w-full min-w-xl border-collapse text-left text-base">
          <thead>
            <tr class="border-b border-line bg-surface-hover">
              <th
                v-for="col in columns"
                :key="col"
                class="px-4 py-2.5 text-[13px] font-semibold text-ink-3"
              >
                {{ t(col) }}
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
    </LegalSection>

    <LegalSection
      v-for="[heading, info] in afterTable"
      :key="heading"
      :heading="heading"
      :info="info"
    />
  </LegalPage>
</template>
