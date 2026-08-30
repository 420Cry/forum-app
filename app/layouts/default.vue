<script setup lang="ts">
import AppLegalFooter from '~/components/legal/AppLegalFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader show-sign-out />
    <main class="flex-1">
      <slot />
    </main>
    <AppLegalFooter />
  </div>
</template>
