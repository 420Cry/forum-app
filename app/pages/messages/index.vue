<script setup lang="ts">
import ChatInbox from '~/components/chat/ChatInbox.vue'

definePageMeta({
  layout: 'home',
  access: 'protected',
  ssr: false,
})
</script>

<template>
  <ClientOnly>
    <ChatInbox />
    <template #fallback>
      <div class="rounded-md border border-line bg-card shadow-1">
        <LoadingState padding="lg" />
      </div>
    </template>
  </ClientOnly>
</template>
