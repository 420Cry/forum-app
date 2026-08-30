<script setup lang="ts">
import LegalFooter from '~/components/legal/LegalFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader show-sign-out />
    <div class="flex-1">
      <slot />
    </div>
    <footer class="mt-auto border-t border-line bg-card p-4 sm:px-7">
      <div class="flex justify-center">
        <LegalFooter />
      </div>
    </footer>
  </div>
</template>
