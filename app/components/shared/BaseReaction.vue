<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactionType } from '~/types/reaction'
import BaseIcon from './BaseIcon.vue'

const reaction = cva(
  [
    'rounded-full',
    'inline-flex',
    'items-center',
    'justify-center',
    'text-white',
    'p-2',
  ],
  {
    variants: {
      intent: {
        back: ['bg-reaction-backed'],
        watch: ['bg-reaction-watch'],
        signal: ['bg-reaction-signal'],
        celebrate: ['bg-reaction-celebrate'],
        insight: ['bg-reaction-insight'],
      },
      size: {
        lg: 'size-9',
        md: 'size-6',
        sm: 'size-5',
      },
    },
  },
)

type ReactionSize = VariantProps<typeof reaction>['size']

const props = withDefaults(
  defineProps<{ intent: ReactionType, size?: ReactionSize }>(),
  {
    size: 'lg',
  },
)
</script>

<template>
  <BaseIcon
    :name="props.intent"
    :class="reaction({ intent: props.intent, size: props.size })"
  />
</template>
