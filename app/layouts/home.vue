<script setup lang="ts">
import LeftRail from '~/components/home/shared/LeftRail.vue'
import SuggestRail from '~/components/directory/SuggestRail.vue'

const route = useRoute()

const showSuggestRail = computed(() => {
  const path = route.path.replace(/\/$/, '')
  return /\/find$/.test(path)
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader is-protected-route />
    <div
      class="mx-auto w-full max-w-[1360px] px-7 py-6 grid gap-6 items-start"
      :class="
        showSuggestRail
          ? 'grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px]'
          : 'grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]'
      "
    >
      <aside class="hidden lg:block sticky top-6">
        <LeftRail />
      </aside>
      <main class="min-w-0">
        <slot />
      </main>
      <aside
        v-if="showSuggestRail"
        class="hidden xl:block sticky top-6"
      >
        <SuggestRail />
      </aside>
    </div>
  </div>
</template>
