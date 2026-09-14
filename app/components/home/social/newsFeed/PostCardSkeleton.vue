<script setup lang="ts">
import BaseSkeleton from '~/components/shared/BaseSkeleton.vue'
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-md border border-line bg-card shadow-1">
    <header class="flex items-start gap-3 px-[18px] pb-2 pt-3.5">
      <BaseSkeleton
        rounded="full"
        class="size-12 shrink-0"
      />
      <div class="min-w-0 flex-1 space-y-2">
        <BaseSkeleton class="h-3.5 w-32" />
        <BaseSkeleton class="h-3 w-44 max-w-full" />
        <BaseSkeleton class="h-2.5 w-20" />
      </div>
    </header>

    <div class="space-y-2 px-[18px] pb-3.5 pt-1">
      <BaseSkeleton class="h-3.5 w-full" />
      <BaseSkeleton class="h-3.5 w-4/5" />
    </div>

    <BaseSkeleton
      rounded="none"
      class="h-80 w-full"
    />

    <div class="flex items-center justify-between px-[18px] pb-2 pt-2.5">
      <BaseSkeleton class="h-3 w-24" />
      <BaseSkeleton class="h-3 w-16" />
    </div>
    <div class="mx-[18px] h-px bg-line" />
    <div class="flex items-center gap-2 px-[18px] py-2.5">
      <BaseSkeleton class="h-8 w-20" />
      <BaseSkeleton class="h-8 w-20" />
      <BaseSkeleton class="h-8 w-20" />
    </div>
  </article>
</template>
