<script setup lang="ts">
defineProps<{
  message?: string | null
}>()
</script>

<template>
  <p
    v-if="message"
    role="alert"
    class="text-sm text-red-600"
  >
    {{ message }}
  </p>
</template>
