<script setup lang="ts">
import fundedrLogo from '~/assets/logo/FundedrLogo.png'

const localePath = useLocalePath()
const { t } = useI18n()
</script>

<template>
  <NuxtLink
    :to="localePath('/')"
    class="inline-flex shrink-0"
    :aria-label="t('common.heading.forum')"
  >
    <img
      :src="fundedrLogo"
      alt="Fundedr"
      class="h-7 w-auto"
      width="120"
      height="28"
    />
  </NuxtLink>
</template>
