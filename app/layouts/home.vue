<script setup lang="ts">
import LeftRail from '~/components/home/LeftRail.vue'
import RightRail from '~/components/home/RightRail.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader is-protected-route />
    <main class="flex-1 mx-auto w-full max-w-340 px-7 pt-6 pb-14">
      <div class="grid grid-cols-[280px_1fr_320px] items-start gap-6">
        <aside>
          <LeftRail />
        </aside>
        <section class="min-w-0">
          <slot />
        </section>
        <aside>
          <RightRail />
        </aside>
      </div>
    </main>
  </div>
</template>
