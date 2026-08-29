<script setup lang="ts">
import BaseSkeleton from '~/components/shared/BaseSkeleton.vue'

withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 3,
  },
)
</script>

<template>
  <article
    v-for="index in count"
    :key="index"
    class="grid grid-cols-[56px_minmax(0,1fr)] items-start gap-x-4 gap-y-3.5 rounded-md border border-line bg-card px-5 py-4.5 shadow-1 lg:grid-cols-[56px_minmax(0,1fr)_132px] lg:items-center sm:gap-x-4.5"
    aria-hidden="true"
  >
    <BaseSkeleton
      rounded="full"
      class="size-14 shrink-0"
    />
    <div class="min-w-0 space-y-2 lg:pr-2">
      <BaseSkeleton class="h-5 w-40 max-w-full" />
      <BaseSkeleton class="h-3.5 w-28 max-w-full" />
      <BaseSkeleton class="h-3.5 w-full max-w-md" />
    </div>
    <div
      class="col-span-2 grid w-full min-w-0 grid-cols-2 gap-2 lg:col-span-1 lg:min-w-33 lg:grid-cols-1"
    >
      <BaseSkeleton class="h-9 w-full" />
      <BaseSkeleton class="h-9 w-full" />
    </div>
  </article>
</template>
