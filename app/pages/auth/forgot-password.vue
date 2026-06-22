<script setup lang="ts">
import BaseButton from "~/components/shared/BaseButton.vue";
import BaseInput from "~/components/shared/BaseInput.vue";

definePageMeta({ layout: 'auth' })

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
      <h2 class="text-2xl font-bold text-ink">Reset password</h2>
      <p class="mt-1 text-sm text-ink-3">
        Enter your email and we'll send you a link to reset your password.
      </p>
    </div>
    <div
      class="mx-auto max-w-md bg-card border border-line rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] p-6"
    >
      <form v-if="!resetSent" class="space-y-4" @submit.prevent="submit">
        <div>
          <BaseInput
            id="email"
            v-model="email"
            label="Email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <BaseButton
          type="submit"
          :disabled="loading"
          size="md"
          class="w-full justify-center"
        >
          {{ loading ? 'Sending...' : 'Send reset link' }}
        </BaseButton>
      </form>
      <div
        v-else
        class="rounded-[var(--radius-md)] border border-brand-200 bg-brand-50 p-4 text-sm text-brand"
      >
        <p class="font-semibold">Check your email</p>
        <p class="mt-1 text-ink-3">
          We've sent a password reset link to <strong class="text-ink-2">{{ email }}</strong>
        </p>
        <NuxtLink
          to="/auth/login"
          class="mt-3 inline-block text-sm font-semibold text-brand hover:text-brand-hover"
        >
          Back to sign in
        </NuxtLink>
      </div>
      <p v-if="!resetSent" class="mt-4 text-center text-sm text-ink-3">
        <NuxtLink to="/auth/login" class="font-semibold text-brand hover:text-brand-hover">
          ← Back to sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
