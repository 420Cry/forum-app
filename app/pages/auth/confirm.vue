<script setup lang="ts">
import { useSupabaseAuth } from "~/composables";

definePageMeta({ layout: "auth" });

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const { refreshUser } = useSupabaseAuth();
const status = ref<"confirming" | "verified" | "failed">("confirming");

onMounted(async () => {
  await supabase.auth.getSession();
  const verified = await refreshUser();
  status.value = verified ? "verified" : "confirming";
});

watch(
  user,
  async (currentUser) => {
    if (currentUser?.email_confirmed_at) {
      status.value = "verified";
      await navigateTo("/auth");
    }
  },
  { immediate: true },
);

watch(status, async (value) => {
  if (value === "verified") {
    await navigateTo("/auth");
  }
});

async function retry() {
  status.value = "confirming";
  const verified = await refreshUser();
  status.value = verified ? "verified" : "failed";
}
</script>

<template>
  <div class="mx-auto max-w-md rounded-lg border bg-white p-8 text-center shadow-sm">
    <p v-if="status === 'confirming'" class="text-slate-600">
      Confirming your email...
    </p>
    <p v-else-if="status === 'failed'" class="text-slate-600">
      We could not confirm your email yet. Try again after clicking the link in
      your inbox.
    </p>
    <button
      v-if="status === 'failed'"
      type="button"
      class="mt-4 rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      @click="retry"
    >
      Check again
    </button>
  </div>
</template>
