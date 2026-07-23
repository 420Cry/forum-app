<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'
import type { iconNameType } from '~/types/iconType'

defineProps<{
  icon: iconNameType
  title: string
  description?: string
}>()
</script>

<template>
  <div class="isolate flex flex-col items-center px-6 py-8 text-center">
    <div class="relative mb-3.5 flex items-center justify-center">
      <span
        aria-hidden="true"
        class="absolute size-[70px] rounded-full border border-sand"
      />
      <span
        aria-hidden="true"
        class="absolute size-[52px] rounded-full border border-line/60"
      />
      <span
        class="relative flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink-4"
      >
        <BaseIcon
          :name="icon"
          size="20px"
        />
      </span>
    </div>

    <p class="text-[13px] font-semibold text-ink-2">
      {{ title }}
    </p>
    <p
      v-if="description"
      class="mt-1 max-w-[210px] text-xs/relaxed text-ink-4"
    >
      {{ description }}
    </p>
  </div>
</template>
