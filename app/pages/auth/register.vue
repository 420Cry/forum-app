<script setup lang="ts">
import { useSupabaseAuth, useToast } from '~/composables'
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'

definePageMeta({ layout: 'auth' })

const { register, loading, error, clearError } = useSupabaseAuth()
const toast = useToast()
const email = ref('')
const password = ref('')

async function submit() {
  clearError()
  await register(email.value, password.value)
  if (!error.value) {
    toast.showSuccess(
      'Account created. Check your email to verify your address.',
    )
    await navigateTo('/auth')
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-ink">
        Create account
      </h2>
      <p class="mt-1 text-sm text-ink-3">
        Sign up to join the forum
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
            label="Email"
            type="email"
            required
            placeholder="you@example.com"
          />
        </div>
        <div>
          <BaseInput
            id="password"
            v-model="password"
            label="Password"
            type="password"
            required
            minlength="6"
            placeholder="••••••••"
          />
          <p class="mt-1 text-xs text-ink-4">
            At least 6 characters
          </p>
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
          {{ loading ? "Creating account..." : "Create account" }}
        </BaseButton>
      </form>
      <p class="mt-4 text-center text-sm text-ink-3">
        Already have an account?
        <NuxtLink
          to="/auth/login"
          class="font-semibold text-brand hover:text-brand-hover"
        >
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
