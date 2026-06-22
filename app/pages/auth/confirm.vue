<script setup lang="ts">
import { useSupabaseAuth } from "~/composables";
import BaseButton from "~/components/shared/BaseButton.vue";

definePageMeta({ layout: "auth" });

const { refreshUser } = useSupabaseAuth();
const status = ref<"confirming" | "verified" | "failed">("confirming");

onMounted(async () => {
  const verified = await refreshUser();
  if (verified) {
    await navigateTo("/auth");
    return;
  }
  status.value = "failed";
});

async function retry() {
  status.value = "confirming";
  const verified = await refreshUser();
  if (verified) {
    await navigateTo("/auth");
    return;
  }
  status.value = "failed";
}
</script>

<template>
  <div
    class="mx-auto max-w-md bg-card border border-line rounded-[var(--radius-xl)] shadow-[var(--shadow-1)] p-8 text-center"
  >
    <p v-if="status === 'confirming'" class="text-ink-3">
      Confirming your email...
    </p>
    <p v-else-if="status === 'failed'" class="text-ink-3">
      We could not confirm your email yet. Try again after clicking the link in
      your inbox.
    </p>
    <BaseButton
      v-if="status === 'failed'"
      type="button"
      size="md"
      class="mt-4"
      @click="retry"
    >
      Check again
    </BaseButton>
  </div>
</template>
