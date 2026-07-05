<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '../shared/BaseIcon.vue'
import type { iconNameType } from '~/types/iconType'

type propsType = {
  iconName: iconNameType
  title: string
  description: string
  size?: string
  class?: string
  active: boolean
  variants: 'roles' | 'goals'
}

const props = withDefaults(defineProps<propsType>(), {
  size: '1.6em',
  class: 'text-brand',
})

const computedIconClass = computed(() => {
  return 'stroke-[10px] ' + props.class
})

const computedCardClass = computed(() => {
  return [
    'relative flex flex-col gap-4 px-6 py-[26px] cursor-pointer border-[1.5px]',
    'rounded-[var(--radius-lg)] transition-[border-color,box-shadow] duration-150',
    {
      'bg-card border-line hover:border-line-2': !props.active,
      'bg-card border-brand shadow-[0_0_0_3px_var(--color-brand-tint)]':
        props.active,
    },
  ]
})
</script>

<template>
  <div :class="computedCardClass">
    <span
      class="absolute top-[18px] right-5 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 transition"
      :class="props.active ? 'bg-brand border-brand' : 'bg-card border-line-2'"
    >
      <BaseIcon
        v-if="props.active"
        name="checkMark"
        size="0.7em"
        class="text-white"
      />
    </span>

    <div
      class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-tint text-brand"
    >
      <BaseIcon
        :name="iconName"
        :class="computedIconClass"
        :size="props.size"
      />
    </div>

    <div class="flex flex-col">
      <h3 class="text-[19px] font-bold leading-tight tracking-[-0.014em] text-ink">
        {{ props.title }}
      </h3>
      <h4 class="mt-2 text-[13.5px] leading-[1.55] text-ink-3">
        {{ props.description }}
      </h4>
    </div>
  </div>
</template>
