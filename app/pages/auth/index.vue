<script setup lang="ts">
import { useSupabaseAuth } from "~/composables";

definePageMeta({ layout: "auth" });

const {
  user,
  logout,
  isAuthenticated,
  resendVerificationEmail,
  refreshUser,
  loading,
  error,
  clearError,
} = useSupabaseAuth();
const verificationResent = ref(false);
const checkingVerification = ref(false);

onMounted(() => {
  if (user.value && !user.value.emailVerified) {
    void refreshUser();
  }
});

async function handleCheckVerified() {
  checkingVerification.value = true;
  clearError();
  await refreshUser();
  checkingVerification.value = false;
}

async function handleResendVerification() {
  verificationResent.value = false;
  clearError();
  await resendVerificationEmail();
  if (!error.value) verificationResent.value = true;
}
</script>

<template>
  <div v-if="isAuthenticated && user" class="space-y-6">
    <div class="rounded-lg border bg-white p-6 shadow-sm">
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600"
        >
          {{ user.email?.[0]?.toUpperCase() ?? "?" }}
        </div>
        <div>
          <p class="font-medium text-slate-800">
            {{ user.email }}
          </p>
          <p class="text-sm text-slate-500">
            {{ user.emailVerified ? "Signed in" : "Email not verified" }}
          </p>
        </div>
      </div>

      <div
        v-if="!user.emailVerified"
        class="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
      >
        <p class="font-medium">Verify your email</p>
        <p class="mt-1 text-amber-700">
          We sent a verification link to {{ user.email }}. Check your inbox or
          resend below.
        </p>
        <p v-if="verificationResent" class="mt-2 font-medium text-green-700">
          Verification email sent.
        </p>
        <p v-if="error" class="mt-2 text-red-600">
          {{ error }}
        </p>
        <button
          type="button"
          :disabled="loading || checkingVerification"
          class="mt-3 mr-3 rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          @click="handleCheckVerified"
        >
          {{ checkingVerification ? "Checking..." : "I've verified my email" }}
        </button>
        <button
          type="button"
          :disabled="loading"
          class="mt-3 rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
          @click="handleResendVerification"
        >
          {{ loading ? "Sending..." : "Resend verification email" }}
        </button>
      </div>

      <div v-if="user.emailVerified" class="mt-4">
        <button
          type="button"
          class="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="logout"
        >
          Sign out
        </button>
      </div>
    </div>
  </div>

  <div
    v-else
    class="mx-auto max-w-md rounded-lg border bg-white p-8 shadow-sm text-center"
  >
    <h2 class="text-xl font-semibold text-slate-800">Account</h2>
    <p class="mt-2 text-slate-500">Sign in or create an account to continue</p>
    <div class="mt-6 flex flex-col gap-3">
      <NuxtLink
        to="/auth/login"
        class="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Sign in
      </NuxtLink>
      <NuxtLink
        to="/auth/register"
        class="rounded border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Create account
      </NuxtLink>
    </div>
  </div>
</template>
