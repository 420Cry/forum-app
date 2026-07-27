<script setup lang="ts">
import LeftRail from '~/components/home/shared/LeftRail.vue'
import RightRail from '~/components/home/shared/RightRail.vue'
import { useUpload } from '~/composables/posts/useUpload'

const { isComposerOpen, closeComposer } = useUpload()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-surface">
    <SharedAppHeader is-protected-route />
    <main class="flex-1 mx-auto w-full max-w-340 px-7 pt-6 pb-14">
      <div class="grid grid-cols-[280px_1fr_320px] items-start gap-6">
        <aside class="sticky top-20">
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

    <!-- Darkening scrim behind the composer -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      leave-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isComposerOpen"
        class="fixed inset-0 z-(--z-overlay) bg-[rgb(20_30_45/0.55)] backdrop-blur-[1px]"
        aria-hidden="true"
        @click="closeComposer"
      />
    </Transition>
  </div>
</template>
