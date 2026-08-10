<script setup lang="ts">
import NotFoundView from '~/components/shared/NotFoundView.vue'

definePageMeta({
  layout: false,
  access: 'public',
})

// Ensure unknown paths are a real 404 (not a soft client miss).
const event = useRequestEvent()
if (event) {
  setResponseStatus(event, 404)
}
</script>

<template>
  <NotFoundView :status-code="404" />
</template>
