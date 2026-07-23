<script setup lang="ts">
import { useAccount } from '~/composables/accounts/useAccount'

const { t } = useI18n()
const { isUserPaid } = useAccount()
</script>

<template>
  <!-- member recommendation -->
  <div
    v-if="!isUserPaid"
    class="w-full bg-card py-3.5 px-4 border border-line rounded-lg shadow-1 flex flex-col gap-1"
  >
    <p class="font-semibold text-sm text-ink">
      {{ t('social.heading.become_member') }}
    </p>
    <p class="text-xs/relaxed text-ink-3">
      {{ t('social.info.become_member') }}
    </p>
    <p class="mt-1 text-xs text-brand font-semibold">
      {{ t('social.action.learn_more') }} →
    </p>
  </div>
</template>
