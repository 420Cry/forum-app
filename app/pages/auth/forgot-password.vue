<script setup lang="ts">
import { useAuthRedirectLinks } from '~/composables/auth/useAuthRedirectLinks'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import { buttonClass } from '~/utils/buttonClass'

definePageMeta({ layout: 'auth', access: 'guest' })

const { t } = useI18n()
const { resetPassword, loading, error, clearError } = useSupabaseAuth()
const { loginTo } = useAuthRedirectLinks()
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
  <AuthFormPanel>
    <template #top>
      {{ t('auth.info.remembered_password') }}
      <NuxtLink
        :to="loginTo"
        class="font-semibold text-brand hover:underline"
      >
        {{ t('auth.action.sign_in') }}
      </NuxtLink>
    </template>

    <AuthFormHeader
      v-if="!resetSent"
      :title="t('auth.heading.reset_password')"
      :subtitle="t('auth.info.reset_password_subtitle')"
    />
    <AuthFormHeader
      v-else
      :title="t('auth.heading.check_email')"
    >
      <template #subtitle>
        {{ t('auth.info.reset_link_sent_prefix') }}
        <b class="font-semibold text-ink-2">{{ email }}</b>.
        {{ t('auth.info.reset_link_sent_suffix') }}
      </template>
    </AuthFormHeader>

    <form
      v-if="!resetSent"
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
            ? t('auth.action.sending')
            : t('auth.action.send_reset_link')
        }}
      </BaseButton>
      <NuxtLink
        :to="loginTo"
        :class="buttonClass({ intent: 'secondary', size: 'lg', block: true }) + ' h-12! text-[14.5px]!'"
      >
        ← {{ t('auth.action.back_to_sign_in') }}
      </NuxtLink>
    </form>

    <div
      v-else
      class="flex flex-col gap-4"
    >
      <NuxtLink
        :to="loginTo"
        :class="buttonClass({ intent: 'secondary', size: 'lg', block: true }) + ' h-12! text-[14.5px]!'"
      >
        ← {{ t('auth.action.back_to_sign_in') }}
      </NuxtLink>
      <p class="text-[13.5px] text-ink-3">
        {{ t('auth.info.reset_resend_prefix') }}
        <button
          type="button"
          class="cursor-pointer border-0 bg-transparent p-0 font-semibold text-brand hover:underline"
          :disabled="loading"
          @click="submit"
        >
          {{ t('auth.action.resend_link') }}
        </button>
      </p>
    </div>

    <template
      v-if="!resetSent"
      #foot
    >
      {{ t('auth.info.no_email_access') }}
      <a
        href="mailto:support@fundedr.com"
        class="font-semibold text-brand hover:underline"
      >
        {{ t('auth.action.contact_support') }}
      </a>
    </template>
  </AuthFormPanel>
</template>
