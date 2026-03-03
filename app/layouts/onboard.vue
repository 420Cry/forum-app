<script setup lang="ts">
import BaseHeader from "~/components/shared/BaseHeader.vue";
</script>

<template>
  <div class="min-h-screen bg-bgColor">
    <BaseHeader>
      <template #logo>
        <div>
          <img
            src="../assets/logo/FundedrLogo.png"
            alt="FundedrLogo"
            class="max-w-32 object-cover"
          />
        </div>
      </template>
      <template #right>
        <button
          class="text-neutral-100 bg-primary-900 px-4 py-2 font-semibold rounded-lg"
        >
          Logout
        </button>
      </template>
    </BaseHeader>
    <main class="mx-auto max-w-280.5 px-6 py-12">
      <slot />
    </main>
  </div>
</template>
