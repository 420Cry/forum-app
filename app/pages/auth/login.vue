<script setup lang="ts">
import { useSupabaseAuth, useToast, useUserProfile } from '~/composables'
import { postAuthPath } from '~/types/user'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'

definePageMeta({ layout: 'auth' })

const { t } = useI18n()
const { login, loading, error, clearError } = useSupabaseAuth()
const { refreshProfile } = useUserProfile()
const toast = useToast()
const email = ref('')
const password = ref('')

async function submit() {
  clearError()
  await login(email.value, password.value)
  if (!error.value) {
    toast.showSuccess(t('auth.info.signed_in_toast'), 1500)
    const me = await refreshProfile(true)
    await navigateTo(postAuthPath(me?.profile ?? null), { replace: true })
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-ink">
        {{ t('auth.heading.sign_in') }}
      </h2>
      <p class="mt-1 text-sm text-ink-3">
        {{ t('auth.info.sign_in_subtitle') }}
      </p>
    </div>
    <div
      class="mx-auto max-w-md bg-card border border-line rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] p-6"
    >
      <form
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
        <div>
          <div class="mb-1 flex items-center justify-between">
            <label
              for="password"
              class="text-sm font-semibold text-ink-2"
            >
              {{ t('auth.label.password') }}
            </label>
            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm text-ink-3 hover:text-ink"
            >
              {{ t('auth.action.forgot_password') }}
            </NuxtLink>
          </div>
          <BaseInput
            id="password"
            v-model="password"
            label=""
            type="password"
            required
            :placeholder="t('auth.label.password_placeholder')"
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
            loading ? t('auth.action.signing_in') : t('auth.action.sign_in')
          }}
        </BaseButton>
      </form>
      <p class="mt-4 text-center text-sm text-ink-3">
        {{ t('auth.info.no_account') }}
        <NuxtLink
          to="/auth/register"
          class="font-semibold text-brand hover:text-brand-hover"
        >
          {{ t('auth.action.create_account') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
