<script setup lang="ts">
import { useSupabaseAuth, useUserProfile } from '~/composables'
import { useAuthCallbackPage } from '~/composables/auth/useAuthCallbackPage'
import { useToast } from '~/composables/useToast'
import BaseButton from '~/components/shared/BaseButton.vue'
import PasswordRequirements from '~/components/auth/PasswordRequirements.vue'
import { createPasswordSchema } from '~/utils/passwordSchema'
import { postAuthPath } from '~/types/user'
import { mapSupabaseAuthError } from '~/utils/authErrors'

definePageMeta({ layout: 'auth', access: 'callback' })

const { t } = useI18n()
const localePath = useLocalePath()
const supabase = useSupabaseClient()
const { refreshUser } = useSupabaseAuth()
const { refreshProfile, clearProfile } = useUserProfile()
const { resolveFromUrl } = useAuthCallbackPage()
const toast = useToast()
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const confirmError = ref<string | null>(null)
const status = ref<'loading' | 'ready' | 'failed'>('loading')

async function initFromResetLink() {
  status.value = 'loading'
  error.value = null

  const callback = await resolveFromUrl()
  if (!callback.ok) {
    status.value = 'failed'
    error.value = callback.message
    return
  }

  const { data } = await supabase.auth.getSession()
  status.value = data.session ? 'ready' : 'failed'
  if (!data.session) {
    error.value = t('auth.info.open_reset_link')
  }
}

onMounted(() => {
  void initFromResetLink()
})

async function submit() {
  loading.value = true
  error.value = null
  passwordError.value = null
  confirmError.value = null

  const passwordSchema = createPasswordSchema(t)
  const validation = passwordSchema.safeParse(password.value)
  if (!validation.success) {
    passwordError.value = validation.error.issues[0]?.message ?? null
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    confirmError.value = t('auth.error.password_mismatch')
    loading.value = false
    return
  }

  const { error: err } = await supabase.auth.updateUser({
    password: password.value,
  })
  loading.value = false
  if (err) {
    error.value = mapSupabaseAuthError(err, t)
    return
  }

  await refreshUser()
  toast.showSuccess(t('auth.info.password_updated_toast'), 1500)
  clearProfile()
  const me = await refreshProfile(false)
  await navigateTo(localePath(postAuthPath(me?.profile ?? null)), { replace: true })
}
</script>

<template>
  <AuthFormPanel>
    <template #top>
      {{ t('auth.info.need_help') }}
      <a
        href="mailto:support@fundedr.com"
        class="font-semibold text-brand hover:underline"
      >
        {{ t('auth.action.contact_support') }}
      </a>
    </template>

    <AuthFormHeader
      :title="t('auth.heading.set_new_password')"
      :subtitle="status === 'ready' ? t('auth.info.set_new_password_subtitle') : undefined"
    />

    <p
      v-if="status === 'loading'"
      class="flex justify-center py-8"
    >
      <LoadingState
        size="sm"
        padding="none"
      />
    </p>
    <p
      v-else-if="status === 'failed'"
      class="text-sm text-red-600"
    >
      {{ error ?? t('auth.info.open_reset_link') }}
    </p>
    <form
      v-else
      class="flex flex-col gap-4"
      @submit.prevent="submit"
    >
      <div>
        <AuthPasswordField
          id="password"
          v-model="password"
          :label="t('auth.label.new_password')"
          :placeholder="t('auth.label.password_placeholder')"
          :intent="passwordError ? 'error' : 'primary'"
          :error-msg="passwordError ?? undefined"
        />
        <PasswordRequirements :password="password" />
      </div>
      <AuthPasswordField
        id="confirm-password"
        v-model="confirmPassword"
        :label="t('auth.label.confirm_password')"
        :placeholder="t('auth.label.password_placeholder')"
        :intent="confirmError ? 'error' : 'primary'"
        :error-msg="confirmError ?? undefined"
      />
      <AuthFormError :message="error" />
      <BaseButton
        type="submit"
        :disabled="loading"
        size="lg"
        block
        class="h-12! text-[14.5px]!"
      >
        {{
          loading
            ? t('auth.action.saving')
            : t('auth.action.update_password')
        }}
      </BaseButton>
    </form>

    <template #foot>
      {{ t('auth.info.password_updated_sign_in') }}
    </template>
  </AuthFormPanel>
</template>
