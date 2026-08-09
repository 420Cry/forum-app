<script setup lang="ts">
import LeftRail from '~/components/home/shared/LeftRail.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader is-protected-route />
    <div
      class="mx-auto grid w-full max-w-340 grid-cols-1 items-start gap-6 px-7 py-6 lg:grid-cols-[280px_minmax(0,1fr)]"
    >
      <aside class="hidden lg:block sticky top-6">
        <LeftRail />
      </aside>
      <main class="min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>
