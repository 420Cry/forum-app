<script setup lang="ts">
import { useToast } from "~/composables";
import BaseButton from "~/components/shared/BaseButton.vue";
import BaseInput from "~/components/shared/BaseInput.vue";

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
  <div
    class="mx-auto max-w-md bg-card border border-line rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] p-6"
  >
    <h2 class="text-2xl font-bold text-ink">Set a new password</h2>
    <p v-if="!ready" class="mt-2 text-sm text-ink-3">
      Open the reset link from your email to continue.
    </p>
    <form v-else class="mt-4 space-y-4" @submit.prevent="submit">
      <div>
        <BaseInput
          id="password"
          v-model="password"
          label="New password"
          type="password"
          required
          minlength="6"
          placeholder="••••••••"
        />
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <BaseButton
        type="submit"
        :disabled="loading"
        size="md"
        class="w-full justify-center"
      >
        {{ loading ? "Saving..." : "Update password" }}
      </BaseButton>
    </form>
  </div>
</template>
