<script setup lang="ts">
import LegalFooter from '~/components/legal/LegalFooter.vue'
</script>

<template>
  <section class="flex h-full min-h-0 flex-col overflow-hidden bg-card p-6  lg:px-14 lg:py-9">
    <div class="mb-4 flex shrink-0 items-center justify-between gap-3 lg:hidden">
      <span class="font-wordmark text-[26px] font-semibold leading-none tracking-[-0.005em] text-ink">
        fund<span class="text-accent">e</span>dr
      </span>
    </div>

    <div
      v-if="$slots.top"
      class="flex shrink-0 items-center justify-end gap-2 text-[13.5px] text-ink-3"
    >
      <slot name="top" />
    </div>

    <div class="mx-auto flex min-h-0 w-full max-w-[400px] flex-1 flex-col justify-center overflow-y-auto py-4 lg:overflow-hidden">
      <slot />
    </div>

    <p
      v-if="$slots.foot"
      class="mx-auto mt-4 w-full max-w-[400px] shrink-0 text-center text-[13.5px] text-ink-3"
    >
      <slot name="foot" />
    </p>

    <LegalFooter
      compact
      class="mx-auto mt-4 w-full max-w-[400px] shrink-0"
    />
  </section>
</template>
