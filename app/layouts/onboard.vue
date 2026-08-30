<script setup lang="ts">
import AppLegalFooter from '~/components/legal/AppLegalFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader show-sign-out />
    <div class="flex-1">
      <slot />
    </div>
    <AppLegalFooter />
  </div>
</template>
