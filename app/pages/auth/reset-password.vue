<script setup lang="ts">
import { useSupabaseAuth, useToast, useUserProfile } from '~/composables'
import { postAuthPath } from '~/types/user'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import PasswordRequirements from '~/components/auth/PasswordRequirements.vue'
import { createPasswordSchema } from '~/utils/passwordSchema'
import { completeAuthCallbackFromUrl } from '~/utils/supabaseAuthCallback'
import { mapAuthErrorString, mapSupabaseAuthError } from '~/utils/authErrors'
import { ensureLocaleMessagesLoaded } from '~/utils/ensureLocaleMessages'

definePageMeta({ layout: 'auth', access: 'callback' })

const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const supabase = useSupabaseClient()
const { refreshUser } = useSupabaseAuth()
const { refreshProfile, clearProfile } = useUserProfile()
const toast = useToast()
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const status = ref<'loading' | 'ready' | 'failed'>('loading')

async function initFromResetLink() {
  status.value = 'loading'
  error.value = null
  await ensureLocaleMessagesLoaded()

  const callback = await completeAuthCallbackFromUrl(supabase, route.query)
  if (!callback.ok) {
    status.value = 'failed'
    error.value = mapAuthErrorString(
      callback.error,
      t,
      callback.errorCode,
    )
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

  const passwordSchema = createPasswordSchema(t)
  const validation = passwordSchema.safeParse(password.value)
  if (!validation.success) {
    passwordError.value = validation.error.issues[0]?.message ?? null
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
  <div
    class="mx-auto max-w-md bg-card border border-line rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] p-6"
  >
    <h2 class="text-2xl font-bold text-ink">
      {{ t('auth.heading.set_new_password') }}
    </h2>
    <p
      v-if="status === 'loading'"
      class="mt-2 text-sm text-ink-3"
    >
      {{ t('common.info.loading') }}
    </p>
    <p
      v-else-if="status === 'failed'"
      class="mt-2 text-sm text-red-600"
    >
      {{ error ?? t('auth.info.open_reset_link') }}
    </p>
    <form
      v-else
      class="mt-4 space-y-4"
      @submit.prevent="submit"
    >
      <div>
        <BaseInput
          id="password"
          v-model="password"
          :label="t('auth.label.new_password')"
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
      <BaseButton
        type="submit"
        :disabled="loading"
        size="md"
        class="w-full justify-center"
      >
        {{
          loading
            ? t('auth.action.saving')
            : t('auth.action.update_password')
        }}
      </BaseButton>
    </form>
  </div>
</template>
