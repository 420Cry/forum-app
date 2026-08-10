<script setup lang="ts">
import { useSupabaseAuth } from '~/composables'
import BaseButton from '~/components/shared/BaseButton.vue'
import { useAuthCallbackPage } from '~/composables/auth/useAuthCallbackPage'
import { hasAccessToken } from '~/utils/authSession'

definePageMeta({ layout: 'auth', access: 'callback' })

const REDIRECT_DELAY_MS = 1500

const { t } = useI18n()
const localePath = useLocalePath()
const supabase = useSupabaseClient()
const { refreshUser } = useSupabaseAuth()
const { refreshProfile } = useUserProfile()
const { resolveFromUrl } = useAuthCallbackPage()
const status = ref<'confirming' | 'success' | 'failed'>('confirming')
const failureMessage = ref<string | null>(null)

let redirectTimer: ReturnType<typeof setTimeout> | undefined

onUnmounted(() => {
  if (redirectTimer) clearTimeout(redirectTimer)
})

async function goHome() {
  if (redirectTimer) {
    clearTimeout(redirectTimer)
    redirectTimer = undefined
  }
  await navigateTo(localePath('/'), { replace: true })
}

function scheduleRedirect() {
  redirectTimer = setTimeout(() => {
    void goHome()
  }, REDIRECT_DELAY_MS)
}

async function confirmFromLink() {
  status.value = 'confirming'
  failureMessage.value = null

  try {
    const callback = await resolveFromUrl()
    if (!callback.ok) {
      status.value = 'failed'
      failureMessage.value = callback.message
      return
    }

    await refreshUser()

    const { data: sessionData } = await supabase.auth.getSession()
    const hasToken = hasAccessToken(sessionData.session)
    if (!hasToken) {
      status.value = 'failed'
      return
    }

    status.value = 'success'
    void refreshProfile(true).catch(() => {})
    scheduleRedirect()
  }
  catch (err) {
    status.value = 'failed'
    failureMessage.value = err instanceof Error ? err.message : null
  }
}

onMounted(() => {
  void confirmFromLink()
})

async function retry() {
  await confirmFromLink()
}
</script>

<template>
  <div
    class="mx-auto max-w-md bg-card border border-line rounded-xl shadow-1 p-8 text-center"
  >
    <p
      v-if="status === 'confirming'"
      class="text-ink-3"
    >
      {{ t('auth.info.confirming_email') }}
    </p>
    <template v-else-if="status === 'success'">
      <p class="text-ink font-semibold">
        {{ t('auth.info.email_confirm_success') }}
      </p>
      <p class="mt-2 text-sm text-ink-3">
        {{ t('auth.info.email_confirm_redirect') }}
      </p>
      <BaseButton
        type="button"
        size="md"
        class="mt-6 w-full justify-center"
        @click="goHome"
      >
        {{ t('auth.action.continue_to_home') }}
      </BaseButton>
    </template>
    <template v-else>
      <p class="text-ink-3">
        {{ failureMessage ?? t('auth.info.email_confirm_failed') }}
      </p>
      <BaseButton
        type="button"
        size="md"
        class="mt-4"
        @click="retry"
      >
        {{ t('auth.action.check_again') }}
      </BaseButton>
    </template>
  </div>
</template>
