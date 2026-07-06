<script setup lang="ts">
import { useSupabaseAuth } from '~/composables'
import { postAuthPath } from '~/types/user'
import BaseButton from '~/components/shared/BaseButton.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { refreshUser } = useSupabaseAuth()
const { refreshProfile } = useUserProfile()
const status = ref<'confirming' | 'failed'>('confirming')

async function goToPostAuth() {
  const me = await refreshProfile(true)
  await navigateTo(postAuthPath(me?.profile ?? null))
}

onMounted(async () => {
  const hasSession = await refreshUser()
  if (hasSession) {
    await goToPostAuth()
    return
  }
  status.value = 'failed'
})

async function retry() {
  status.value = 'confirming'
  const hasSession = await refreshUser()
  if (hasSession) {
    await goToPostAuth()
    return
  }
  status.value = 'failed'
}
</script>

<template>
  <div
    class="mx-auto max-w-md bg-card border border-line rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] p-8 text-center"
  >
    <p
      v-if="status === 'confirming'"
      class="text-ink-3"
    >
      {{ t('auth.info.confirming_email') }}
    </p>
    <p
      v-else
      class="text-ink-3"
    >
      {{ t('auth.info.email_confirm_failed') }}
    </p>
    <BaseButton
      v-if="status === 'failed'"
      type="button"
      size="md"
      class="mt-4"
      @click="retry"
    >
      {{ t('auth.action.check_again') }}
    </BaseButton>
  </div>
</template>
