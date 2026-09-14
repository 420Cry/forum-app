<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactionType } from '~/types/reaction'
import BaseIcon from './BaseIcon.vue'

const reaction = cva(['inline-flex', 'items-center', 'justify-center'], {
  variants: {
    intent: {
      back: '',
      watch: '',
      signal: '',
      celebrate: '',
      insight: '',
    },
    size: {
      lg: 'size-9',
      md: 'size-6',
      sm: 'size-5',
    },
    active: {
      true: '',
      false: ['rounded-full', 'text-white', 'p-2'],
    },
  },
  compoundVariants: [
    // Inactive: filled circle with white icon
    { intent: 'back', active: false, class: 'bg-reaction-backed' },
    { intent: 'watch', active: false, class: 'bg-reaction-watch' },
    { intent: 'signal', active: false, class: 'bg-reaction-signal' },
    { intent: 'celebrate', active: false, class: 'bg-reaction-celebrate' },
    { intent: 'insight', active: false, class: 'bg-reaction-insight' },
    // Active: bare colored icon, no circle
    { intent: 'back', active: true, class: 'text-reaction-backed' },
    { intent: 'watch', active: true, class: 'text-reaction-watch' },
    { intent: 'signal', active: true, class: 'text-reaction-signal' },
    { intent: 'celebrate', active: true, class: 'text-reaction-celebrate' },
    { intent: 'insight', active: true, class: 'text-reaction-insight' },
  ],
})

type ReactionSize = VariantProps<typeof reaction>['size']

const props = withDefaults(
  defineProps<{
    intent: ReactionType
    size?: ReactionSize
    active?: boolean
    class?: string
  }>(),
  {
    size: 'lg',
    active: false,
    class: '',
  },
)

const computedClass = computed<string>(() => {
  return reaction({
    intent: props.intent,
    size: props.size,
    active: props.active,
  })
})
</script>

<template>
  <BaseIcon
    :name="props.intent"
    :class="`${computedClass} ${props.class ?? ''}`"
  />
</template>
