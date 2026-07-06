<script setup lang="ts">
import { useSupabaseAuth } from '~/composables'
import BaseButton from '~/components/shared/BaseButton.vue'
import { completeAuthCallbackFromUrl } from '~/utils/supabaseAuthCallback'
import { mapAuthErrorString } from '~/utils/authErrors'
import { ensureLocaleMessagesLoaded } from '~/utils/ensureLocaleMessages'
import { hasAccessToken } from '~/utils/authSession'

definePageMeta({ layout: 'auth', access: 'callback' })

const REDIRECT_DELAY_MS = 1500

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const supabase = useSupabaseClient()
const { refreshUser } = useSupabaseAuth()
const { refreshProfile } = useUserProfile()
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
  await ensureLocaleMessagesLoaded()

  const callback = await completeAuthCallbackFromUrl(supabase, route.query)
  if (!callback.ok) {
    status.value = 'failed'
    failureMessage.value = mapAuthErrorString(
      callback.error,
      t,
      callback.errorCode,
    )
    return
  }

  await refreshUser()

  const { data: sessionData } = await supabase.auth.getSession()
  if (!hasAccessToken(sessionData.session)) {
    status.value = 'failed'
    return
  }

  status.value = 'success'
  void refreshProfile(true).catch(() => {})
  scheduleRedirect()
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
    class="mx-auto max-w-md bg-card border border-line rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] p-8 text-center"
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
