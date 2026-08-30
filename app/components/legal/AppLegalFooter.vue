<script setup lang="ts">
import LegalFooter from '~/components/legal/LegalFooter.vue'

withDefaults(
  defineProps<{
    padded?: boolean
  }>(),
  { padded: false },
)
</script>

<template>
  <footer
    class="mt-auto border-t border-line bg-card p-4 sm:px-7"
    :class="padded ? 'pb-24 lg:pb-4' : undefined"
  >
    <div class="mx-auto flex w-full max-w-340 justify-center">
      <LegalFooter />
    </div>
  </footer>
</template>
