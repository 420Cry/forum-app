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
  <AuthFormPanel>
    <AuthFormHeader
      :title="status === 'success'
        ? t('auth.heading.email_verified')
        : status === 'failed'
          ? t('auth.heading.confirming_email')
          : t('auth.heading.confirming_email')"
      :subtitle="status === 'confirming' ? t('auth.info.confirming_email') : undefined"
    />

    <div
      v-if="status === 'success'"
      class="flex flex-col gap-4"
    >
      <div
        class="mb-2 flex size-[60px] items-center justify-center rounded-full bg-brand-tint text-brand"
        aria-hidden="true"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        >
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2.2"
          />
          <path d="M3.6 6.5l8.4 5.8 8.4-5.8" />
        </svg>
      </div>
      <p class="text-sm text-ink-3">
        {{ t('auth.info.email_confirm_redirect') }}
      </p>
      <BaseButton
        type="button"
        size="lg"
        block
        class="h-12! text-[14.5px]!"
        @click="goHome"
      >
        {{ t('auth.action.continue_to_home') }}
      </BaseButton>
    </div>

    <div
      v-else-if="status === 'failed'"
      class="flex flex-col gap-4"
    >
      <p class="text-sm text-ink-3">
        {{ failureMessage ?? t('auth.info.email_confirm_failed') }}
      </p>
      <BaseButton
        type="button"
        size="lg"
        block
        class="h-12! text-[14.5px]!"
        @click="retry"
      >
        {{ t('auth.action.check_again') }}
      </BaseButton>
    </div>
  </AuthFormPanel>
</template>
