<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { resetPassword, loading, error, clearError } = useSupabaseAuth()
const email = ref('')
const resetSent = ref(false)

async function submit() {
  resetSent.value = false
  clearError()
  await resetPassword(email.value)
  if (!error.value) resetSent.value = true
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-ink">
        {{ t('auth.heading.reset_password') }}
      </h2>
      <p class="mt-1 text-sm text-ink-3">
        {{ t('auth.info.reset_password_subtitle') }}
      </p>
    </div>
    <div
      class="mx-auto max-w-md bg-card border border-line rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] p-6"
    >
      <form
        v-if="!resetSent"
        class="space-y-4"
        @submit.prevent="submit"
      >
        <div>
          <BaseInput
            id="email"
            v-model="email"
            :label="t('auth.label.email')"
            type="email"
            required
            :placeholder="t('auth.label.email_placeholder')"
          />
        </div>
        <p
          v-if="error"
          class="text-sm text-red-600"
        >
          {{ error }}
        </p>
        <BaseButton
          type="submit"
          :disabled="loading"
          size="md"
          class="w-full justify-center"
        >
          {{
            loading
              ? t('auth.action.sending')
              : t('auth.action.send_reset_link')
          }}
        </BaseButton>
      </form>
      <div
        v-else
        class="rounded-[var(--radius-md)] border border-brand-200 bg-brand-50 p-4 text-sm text-brand"
      >
        <p class="font-semibold">
          {{ t('auth.heading.check_email') }}
        </p>
        <p class="mt-1 text-ink-3">
          {{ t('auth.info.reset_link_sent', { email }) }}
        </p>
        <NuxtLink
          to="/auth/login"
          class="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-hover"
        >
          {{ t('auth.action.back_to_sign_in') }}
        </NuxtLink>
      </div>
      <p
        v-if="!resetSent"
        class="mt-4 text-center text-sm text-ink-3"
      >
        <NuxtLink
          to="/auth/login"
          class="font-semibold text-brand hover:text-brand-hover"
        >
          ← {{ t('auth.action.back_to_sign_in') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
