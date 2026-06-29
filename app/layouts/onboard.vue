<script setup lang="ts">
import BaseButton from "~/components/shared/BaseButton.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <header
      class="h-14 flex items-center justify-between px-8 bg-card border-b border-line"
    >
      <span
        class="font-wordmark text-2xl font-bold tracking-tight text-ink select-none"
      >
        fund<span class="text-accent">e</span>dr
      </span>
      <BaseButton intent="ghost" size="sm">Sign out</BaseButton>
    </header>
    <slot />
  </div>
</template>
