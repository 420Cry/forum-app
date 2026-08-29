<script setup lang="ts">
import BaseSkeleton from '~/components/shared/BaseSkeleton.vue'
</script>

<template>
  <div
    class="flex flex-col gap-4"
    aria-busy="true"
    aria-hidden="true"
  >
    <div class="overflow-hidden rounded-md border border-line bg-card shadow-1">
      <BaseSkeleton
        rounded="none"
        class="h-40 w-full sm:h-50"
      />
      <div class="px-6 pb-6 sm:px-8">
        <BaseSkeleton
          rounded="full"
          class="-mt-14 size-28 border-4 border-card sm:size-33"
        />
        <div class="mt-4.5 space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <BaseSkeleton class="h-8 w-48 max-w-full" />
            <BaseSkeleton class="h-6 w-20 rounded-full" />
          </div>
          <BaseSkeleton class="h-4 w-full max-w-md" />
          <BaseSkeleton class="h-3.5 w-56 max-w-full" />
          <div class="flex gap-5 pt-1">
            <BaseSkeleton class="h-4 w-24" />
            <BaseSkeleton class="h-4 w-24" />
          </div>
        </div>
      </div>
    </div>

    <div class="rounded-md border border-line bg-card p-6 shadow-1 sm:px-7 sm:py-6">
      <BaseSkeleton class="h-5 w-24" />
      <BaseSkeleton class="mt-3.5 h-4 w-full max-w-lg" />
      <div class="mt-4.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="index in 3"
          :key="index"
          class="space-y-2"
        >
          <BaseSkeleton class="h-3 w-20" />
          <BaseSkeleton class="h-4 w-32 max-w-full" />
        </div>
      </div>
    </div>
  </div>
</template>
