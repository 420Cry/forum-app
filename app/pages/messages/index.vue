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
      <div class="bg-card border border-line rounded-md shadow-1 px-5 py-8 text-center text-sm text-ink-3">
        {{ $t('common.info.loading') }}
      </div>
    </template>
  </ClientOnly>
</template>
