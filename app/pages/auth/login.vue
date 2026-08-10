<script setup lang="ts">
import { useOnboard, useSupabaseAuth, useToast, useUserProfile } from '~/composables'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import {
  AUTH_REDIRECT_QUERY,
  resolvePostAuthPath,
  sanitizeAuthRedirect,
} from '~/utils/authRedirect'

definePageMeta({ layout: 'auth', access: 'guest' })

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const { login, loading, error, clearError } = useSupabaseAuth()
const { refreshProfile, clearProfile } = useUserProfile()
const { resetOnboarding } = useOnboard()
const toast = useToast()
const email = ref('')
const password = ref('')

const redirectParam = computed(() =>
  sanitizeAuthRedirect(route.query[AUTH_REDIRECT_QUERY]),
)

const registerTo = computed(() => ({
  path: localePath('/auth/register'),
  query: redirectParam.value
    ? { [AUTH_REDIRECT_QUERY]: redirectParam.value }
    : undefined,
}))

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
      class="mx-auto max-w-md bg-card border border-line rounded-xl shadow-1 p-6"
    >
      <form
        class="space-y-4"
        onsubmit="return false"
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
              :to="localePath('/auth/forgot-password')"
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
          role="alert"
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
          <SharedLoadingSpinner
            v-if="loading"
            size="sm"
          />
          {{
            loading ? t('auth.action.signing_in') : t('auth.action.sign_in')
          }}
        </BaseButton>
      </form>
      <p class="mt-4 text-center text-sm text-ink-3">
        {{ t('auth.info.no_account') }}
        <NuxtLink
          :to="registerTo"
          class="font-semibold text-brand hover:text-brand-hover"
        >
          {{ t('auth.action.create_account') }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
