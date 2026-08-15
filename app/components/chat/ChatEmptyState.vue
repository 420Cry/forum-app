<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'
import type { iconNameType } from '~/types/iconType'

withDefaults(
  defineProps<{
    title: string
    description: string
    icon?: iconNameType
    showIcon?: boolean
  }>(),
  { icon: 'chat', showIcon: true },
)
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center"
    data-testid="messages-empty"
  >
    <slot name="media">
      <div
        v-if="showIcon"
        class="flex size-14 items-center justify-center rounded-full bg-surface-hover text-ink-3"
        aria-hidden="true"
      >
        <BaseIcon
          :name="icon"
          size="1.75em"
        />
      </div>
    </slot>
    <div class="space-y-1 max-w-[32ch]">
      <p class="text-[15px] font-semibold text-ink">
        {{ title }}
      </p>
      <p class="text-[13px] leading-relaxed text-ink-3">
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>
