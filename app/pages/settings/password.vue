<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import SettingsBackLink from '~/components/settings/SettingsBackLink.vue'
import { useSupabaseAuth } from '~/composables/auth/useSupabaseAuth'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const toast = useToast()
const supabase = useSupabaseClient()
const {
  resetPassword,
  loading: authLoading,
  error: authError,
  clearError,
} = useSupabaseAuth()

const formError = ref<string | null>(null)
const sent = ref(false)
const accountEmail = ref<string | null>(null)

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  accountEmail.value = data.user?.email ?? null
})

async function onSendResetEmail() {
  clearError()
  formError.value = null
  sent.value = false
  if (!accountEmail.value) {
    formError.value = t('settings.error.password_email_missing')
    return
  }
  await resetPassword(accountEmail.value)
  if (authError.value) {
    formError.value = authError.value
    return
  }
  sent.value = true
  toast.showSuccess(
    t('auth.info.reset_link_sent', { email: accountEmail.value }),
    3500,
  )
}
</script>

<template>
  <div class="mx-auto flex max-w-190 flex-col gap-4 pb-8">
    <div>
      <SettingsBackLink />
      <h1 class="text-[22px] font-bold text-ink tracking-[-0.02em]">
        {{ t('settings.heading.password') }}
      </h1>
      <p class="text-[14px] text-ink-3 mt-1.5 max-w-[52ch]">
        {{ t('settings.info.password') }}
      </p>
    </div>

    <section class="bg-card border border-line rounded-md shadow-1 px-6 py-5">
      <h2 class="text-[14px] font-semibold text-ink">
        {{ t('settings.heading.reset_email') }}
      </h2>
      <p class="text-[12.5px] text-ink-4 mt-0.5 mb-4 max-w-[56ch]">
        {{ t('settings.info.reset_email') }}
      </p>

      <p
        v-if="accountEmail"
        class="text-[13px] text-ink-2 mb-4"
      >
        {{ accountEmail }}
      </p>
      <p
        v-else
        class="text-[13px] text-ink-4 mb-4"
      >
        {{ t('settings.error.password_email_missing') }}
      </p>

      <p
        v-if="formError"
        class="text-sm text-red-600 mb-4"
      >
        {{ formError }}
      </p>
      <p
        v-else-if="sent && accountEmail"
        class="text-sm text-ink-2 mb-4"
      >
        {{ t('auth.info.reset_link_sent', { email: accountEmail }) }}
      </p>

      <BaseButton
        intent="primary"
        size="sm"
        :disabled="authLoading || !accountEmail"
        @click="onSendResetEmail"
      >
        {{
          authLoading
            ? t('settings.action.sending')
            : sent
              ? t('settings.action.resend_reset_email')
              : t('settings.action.send_reset_email')
        }}
      </BaseButton>
    </section>
  </div>
</template>
