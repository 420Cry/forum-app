<script setup lang="ts">
import LegalPage from '~/components/legal/LegalPage.vue'
import LegalSection from '~/components/legal/LegalSection.vue'

definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const localePath = useLocalePath()

const beforeCookies = [
  ['common.heading.privacy_who', 'common.info.privacy_who'],
  ['common.heading.privacy_data', 'common.info.privacy_data'],
  ['common.heading.privacy_processors', 'common.info.privacy_processors'],
] as const

const afterCookies = [
  ['common.heading.privacy_rights', 'common.info.privacy_rights'],
  ['common.heading.privacy_contact', 'common.info.privacy_contact'],
] as const
</script>

<template>
  <LegalPage
    title="common.heading.privacy_policy"
    intro="common.info.privacy_intro"
  >
    <LegalSection
      v-for="[heading, info] in beforeCookies"
      :key="heading"
      :heading="heading"
      :info="info"
    />

    <LegalSection heading="common.heading.privacy_cookies">
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
    </LegalSection>

    <LegalSection
      v-for="[heading, info] in afterCookies"
      :key="heading"
      :heading="heading"
      :info="info"
    />
  </LegalPage>
</template>
