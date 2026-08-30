<script setup lang="ts">
import LegalPage from '~/components/legal/LegalPage.vue'
import LegalSection from '~/components/legal/LegalSection.vue'

definePageMeta({ layout: 'home', access: 'public' })

const sections = [
  ['common.heading.terms_use', 'common.info.terms_use'],
  ['common.heading.terms_account', 'common.info.terms_account'],
  ['common.heading.terms_content', 'common.info.terms_content'],
  ['common.heading.terms_acceptable', 'common.info.terms_acceptable'],
  ['common.heading.terms_changes', 'common.info.terms_changes'],
] as const
</script>

<template>
  <LegalPage
    title="common.heading.terms"
    intro="common.info.terms_intro"
  >
    <LegalSection
      v-for="[heading, info] in sections"
      :key="heading"
      :heading="heading"
      :info="info"
    />
  </LegalPage>
</template>
