<script setup lang="ts">
import { useSupabaseAuth, useUserProfile } from '~/composables'
import { useAuthRedirectLinks } from '~/composables/auth/useAuthRedirectLinks'
import { useToast } from '~/composables/useToast'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import PasswordRequirements from '~/components/auth/PasswordRequirements.vue'
import { createPasswordSchema } from '~/utils/passwordSchema'
import {
  resolvePostAuthPath,
} from '~/utils/authRedirect'

definePageMeta({ layout: 'auth', access: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
const { register, loading, error, errorAction, clearError } = useSupabaseAuth()
const { refreshProfile, clearProfile } = useUserProfile()
const { loginTo, redirectParam } = useAuthRedirectLinks()
const toast = useToast()
const email = ref('')
const password = ref('')
const acceptedTerms = ref(false)
const passwordError = ref<string | null>(null)
const termsError = ref<string | null>(null)

async function submit() {
  clearError()
  passwordError.value = null
  termsError.value = null

  if (!acceptedTerms.value) {
    termsError.value = t('auth.error.terms_required')
    return
  }

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
      await navigateTo(loginTo.value, { replace: true })
      return
    }
    clearProfile()
    const me = await refreshProfile(true)
    const target = resolvePostAuthPath(me?.profile ?? null, redirectParam.value)
    await navigateTo(localePath(target), { replace: true })
  }
}
</script>

<template>
  <AuthFormPanel>
    <template #top>
      {{ t('auth.info.already_have_account') }}
      <NuxtLink
        :to="loginTo"
        class="font-semibold text-brand hover:underline"
      >
        {{ t('auth.action.sign_in') }}
      </NuxtLink>
    </template>

    <AuthFormHeader
      :title="t('auth.heading.create_account')"
      :subtitle="t('auth.info.create_account_subtitle')"
    />

    <form
      class="flex flex-col gap-4"
      @submit.prevent="submit"
    >
      <div class="[&_input]:h-[46px] [&_input]:text-sm">
        <BaseInput
          id="email"
          v-model="email"
          :label="t('auth.label.work_email')"
          type="email"
          required
          :placeholder="t('auth.label.email_placeholder')"
        />
      </div>
      <div>
        <AuthPasswordField
          id="password"
          v-model="password"
          :label="t('auth.label.password')"
          :placeholder="t('auth.label.password_placeholder')"
          :intent="passwordError ? 'error' : 'primary'"
          :error-msg="passwordError ?? undefined"
        />
        <PasswordRequirements :password="password" />
      </div>

      <label class="flex cursor-pointer items-start gap-2.5 text-sm text-ink-2">
        <input
          v-model="acceptedTerms"
          type="checkbox"
          class="mt-0.5 size-4 rounded border-line text-brand focus:ring-brand/20"
        >
        <span>{{ t('auth.info.agree_terms') }}</span>
      </label>
      <p
        v-if="termsError"
        class="text-sm text-red-600"
      >
        {{ termsError }}
      </p>

      <AuthFormError :message="error" />
      <p
        v-if="errorAction === 'forgot_password'"
        class="text-sm text-ink-3"
      >
        <NuxtLink
          :to="localePath('/auth/forgot-password')"
          class="font-semibold text-brand hover:underline"
        >
          {{ t('auth.action.forgot_password') }}
        </NuxtLink>
      </p>

      <BaseButton
        type="submit"
        :disabled="loading"
        size="lg"
        block
        class="h-12! text-[14.5px]!"
      >
        {{
          loading
            ? t('auth.action.creating_account')
            : t('auth.action.create_account')
        }}
      </BaseButton>
    </form>

    <p class="mt-4 text-center text-xs/relaxed  text-ink-4">
      {{ t('auth.info.signup_verification_note') }}
    </p>

    <template #foot>
      {{ t('auth.info.already_have_account') }}
      <NuxtLink
        :to="loginTo"
        class="font-semibold text-brand hover:underline"
      >
        {{ t('auth.action.sign_in') }}
      </NuxtLink>
    </template>
  </AuthFormPanel>
</template>
