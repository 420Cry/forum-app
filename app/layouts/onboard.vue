<script setup lang="ts">
import BaseButton from "~/components/shared/BaseButton.vue";
import BaseHeader from "~/components/shared/BaseHeader.vue";
</script>

<template>
  <div class="min-h-screen bg-surface">
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
        <BaseButton>Logout</BaseButton>
      </template>
    </BaseHeader>
    <main class="mx-auto max-w-280.5 px-6 py-12">
      <slot />
    </main>
  </div>
</template>
