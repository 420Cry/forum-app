<script setup lang="ts">
import { useSupabaseAuth, useToast, useUserProfile } from '~/composables'
import { postAuthPath } from '~/types/user'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import PasswordRequirements from '~/components/auth/PasswordRequirements.vue'
import { createPasswordSchema } from '~/utils/passwordSchema'

definePageMeta({ layout: 'auth', access: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
const { register, loading, error, errorAction, clearError } = useSupabaseAuth()
const { refreshProfile, clearProfile } = useUserProfile()
const toast = useToast()
const email = ref('')
const password = ref('')
const passwordError = ref<string | null>(null)

async function submit() {
  clearError()
  passwordError.value = null

  const passwordSchema = createPasswordSchema(t)
  const validation = passwordSchema.safeParse(password.value)
  if (!validation.success) {
    passwordError.value = validation.error.issues[0]?.message ?? null
    return
  }

  const result = await register(email.value, password.value)
  if (!error.value) {
    if (result?.needsVerification) {
      toast.showSuccess(t('auth.info.account_created_toast'), 1500)
      await navigateTo(localePath('/auth/login'), { replace: true })
      return
    }
    clearProfile()
    const me = await refreshProfile(false)
    const target = postAuthPath(me?.profile ?? null)
    await navigateTo(localePath(target), { replace: true })
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-ink">
        {{ t('auth.heading.create_account') }}
      </h2>
      <p class="mt-1 text-sm text-ink-3">
        {{ t('auth.info.create_account_subtitle') }}
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
          <BaseInput
            id="password"
            v-model="password"
            :label="t('auth.label.password')"
            type="password"
            required
            :placeholder="t('auth.label.password_placeholder')"
            :intent="passwordError ? 'error' : 'primary'"
            :error-msg="passwordError ?? undefined"
          />
          <PasswordRequirements :password="password" />
        </div>
        <p
          v-if="error"
          class="text-sm text-red-600"
        >
          {{ error }}
        </p>
        <p
          v-if="errorAction === 'forgot_password'"
          class="text-sm text-ink-3"
        >
          <NuxtLink
            :to="localePath('/auth/forgot-password')"
            class="font-semibold text-brand hover:text-brand-hover"
          >
            {{ t('auth.action.forgot_password') }}
          </NuxtLink>
        </p>
        <BaseButton
          type="submit"
          :disabled="loading"
          size="md"
          class="w-full justify-center"
        >
          {{
            loading
              ? t('auth.action.creating_account')
              : t('auth.action.create_account')
          }}
        </BaseButton>
      </form>
      <p class="mt-4 text-center text-sm text-ink-3">
        {{ t('auth.info.already_have_account') }}
        <NuxtLink
          :to="localePath('/auth/login')"
          class="font-semibold text-brand hover:text-brand-hover"
        >
          {{ t('auth.action.sign_in') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
