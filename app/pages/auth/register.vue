<script setup lang="ts">
import { useSupabaseAuth, useForumApi, useToast } from '~/composables'

definePageMeta({ layout: 'auth' })

const { register, loading, error, clearError } = useSupabaseAuth()
const { fetchMe } = useForumApi()
const toast = useToast()
const email = ref('')
const password = ref('')

async function submit() {
  clearError()
  await register(email.value, password.value)
  if (!error.value) {
    try {
      await fetchMe()
    } catch {
      // User is unverified; backend may reject /auth/me. Ignore.
    }
    toast.showSuccess('Account created. Check your email to verify your address.')
    await navigateTo('/auth')
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-slate-800">
        Create account
      </h2>
      <p class="mt-1 text-slate-500">
        Sign up to join the forum
      </p>
    </div>
    <div class="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-sm">
      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full rounded border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="you@example.com"
          >
        </div>
        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full rounded border border-slate-300 px-3 py-2 text-slate-800 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="••••••••"
          >
          <p class="mt-1 text-xs text-slate-500">
            At least 6 characters
          </p>
        </div>
        <p v-if="error" class="text-sm text-red-600">
          {{ error }}
        </p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {{ loading ? 'Creating account...' : 'Create account' }}
        </button>
      </form>
      <p class="mt-4 text-center text-sm text-slate-500">
        Already have an account?
        <NuxtLink to="/auth/login" class="font-medium text-slate-700 hover:text-slate-900">
          Sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
