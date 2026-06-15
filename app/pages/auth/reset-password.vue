<script setup lang="ts">
import { useToast } from "~/composables";

definePageMeta({ layout: "auth" });

const supabase = useSupabaseClient();
const toast = useToast();
const password = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const ready = ref(false);

onMounted(async () => {
  const { data } = await supabase.auth.getSession();
  ready.value = !!data.session;
});

async function submit() {
  loading.value = true;
  error.value = null;
  const { error: err } = await supabase.auth.updateUser({
    password: password.value,
  });
  loading.value = false;
  if (err) {
    error.value = err.message;
    return;
  }
  toast.showSuccess("Password updated. You can sign in now.");
  await navigateTo("/auth/login");
}
</script>

<template>
  <div class="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-sm">
    <h2 class="text-xl font-semibold text-slate-800">Set a new password</h2>
    <p v-if="!ready" class="mt-2 text-sm text-slate-500">
      Open the reset link from your email to continue.
    </p>
    <form v-else class="mt-4 space-y-4" @submit.prevent="submit">
      <div>
        <label
          for="password"
          class="mb-1 block text-sm font-medium text-slate-700"
        >
          New password
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
      </div>
      <p v-if="error" class="text-sm text-red-600">
        {{ error }}
      </p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {{ loading ? "Saving..." : "Update password" }}
      </button>
    </form>
  </div>
</template>
