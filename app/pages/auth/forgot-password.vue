<script setup lang="ts">
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
      <h2 class="text-xl font-semibold text-slate-800">
        Reset password
      </h2>
      <p class="mt-1 text-slate-500">
        Enter your email and we'll send you a link to reset your password.
      </p>
    </div>
    <div class="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-sm">
      <form v-if="!resetSent" class="space-y-4" @submit.prevent="submit">
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
        <p v-if="error" class="text-sm text-red-600">
          {{ error }}
        </p>
        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {{ loading ? 'Sending...' : 'Send reset link' }}
        </button>
      </form>
      <div v-else class="rounded border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        <p class="font-medium">
          Check your email
        </p>
        <p class="mt-1">
          We've sent a password reset link to <strong>{{ email }}</strong>
        </p>
        <NuxtLink
          to="/auth/login"
          class="mt-3 inline-block text-sm font-medium text-green-600 hover:text-green-700"
        >
          Back to sign in
        </NuxtLink>
      </div>
      <p v-if="!resetSent" class="mt-4 text-center text-sm text-slate-500">
        <NuxtLink to="/auth/login" class="font-medium text-slate-700 hover:text-slate-900">
          ← Back to sign in
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
