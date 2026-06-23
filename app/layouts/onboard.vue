<script setup lang="ts">
import BaseButton from "~/components/shared/BaseButton.vue";
import BaseHeader from "~/components/shared/BaseHeader.vue";
</script>

<template>
  <div class="min-h-screen bg-surface">
    <BaseHeader>
      <template #logo>
        <span class="font-wordmark text-2xl font-bold tracking-tight text-ink select-none">
          fund<span class="text-accent">e</span>dr
        </span>
      </template>
      <template #right>
        <BaseButton intent="ghost" size="sm">Sign out</BaseButton>
      </template>
    </BaseHeader>
    <main class="mx-auto max-w-[760px] px-6 py-8">
      <slot />
    </main>
  </div>
</template>
