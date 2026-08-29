<script setup lang="ts">
import { useOnboard, useSupabaseAuth, useUserProfile } from '~/composables'
import { useAuthRedirectLinks } from '~/composables/auth/useAuthRedirectLinks'
import { useToast } from '~/composables/useToast'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import { resolvePostAuthPath } from '~/utils/authRedirect'

definePageMeta({ layout: 'auth', access: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
const { login, loading, error, clearError } = useSupabaseAuth()
const { refreshProfile, clearProfile } = useUserProfile()
const { resetOnboarding } = useOnboard()
const { registerTo, redirectParam } = useAuthRedirectLinks()
const toast = useToast()
const email = ref('')
const password = ref('')

async function submit() {
  clearError()
  await login(email.value, password.value)
  if (!error.value) {
    toast.showSuccess(t('auth.info.signed_in_toast'), 1500)
    resetOnboarding()
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
      {{ t('auth.info.no_account') }}
      <NuxtLink
        :to="registerTo"
        class="font-semibold text-brand hover:underline"
      >
        {{ t('auth.action.create_account') }}
      </NuxtLink>
    </template>

    <AuthFormHeader
      :title="t('auth.heading.welcome_back')"
      :subtitle="t('auth.info.sign_in_subtitle')"
    />

    <form
      class="flex flex-col gap-4"
      @submit.prevent="submit"
    >
      <div class="[&_input]:h-[46px] [&_input]:text-sm">
        <BaseInput
          id="email"
          v-model="email"
          :label="t('auth.label.email')"
          type="email"
          required
          :placeholder="t('auth.label.email_placeholder')"
        />
      </div>
      <AuthPasswordField
        id="password"
        v-model="password"
        :label="t('auth.label.password')"
        :placeholder="t('auth.label.password_placeholder')"
      >
        <template #link>
          <NuxtLink
            :to="localePath('/auth/forgot-password')"
            class="text-[12.5px] font-semibold text-brand hover:underline"
          >
            {{ t('auth.action.forgot_password') }}
          </NuxtLink>
        </template>
      </AuthPasswordField>
      <AuthFormError :message="error" />
      <BaseButton
        type="submit"
        :disabled="loading"
        size="lg"
        block
        class="h-12! text-[14.5px]!"
      >
        <SharedLoadingSpinner
          v-if="loading"
          size="sm"
        />
        {{
          loading ? t('auth.action.signing_in') : t('auth.action.sign_in')
        }}
      </BaseButton>
    </form>

    <template #foot>
      {{ t('auth.info.no_account') }}
      <NuxtLink
        :to="registerTo"
        class="font-semibold text-brand hover:underline"
      >
        {{ t('auth.action.create_account') }}
      </NuxtLink>
    </template>
  </AuthFormPanel>
</template>
