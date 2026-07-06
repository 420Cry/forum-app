<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

const button = cva(
  [
    'inline-flex',
    'items-center',
    'gap-1.5',
    'font-semibold',
    'rounded-pill',
    'transition-colors',
    'cursor-pointer',
    'select-none',
  ],
  {
    variants: {
      intent: {
        'primary': [
          'bg-brand',
          'text-white',
          'hover:bg-brand-hover',
        ],
        'primary-outline': [
          'border',
          'border-brand',
          'text-brand',
          'bg-transparent',
          'hover:bg-surface-hover',
        ],
        'secondary': [
          'border',
          'border-line',
          'text-ink-2',
          'bg-card',
          'hover:bg-surface-hover',
          'hover:border-line-2',
        ],
        'ghost': [
          'text-ink-3',
          'hover:bg-surface-hover',
          'bg-transparent',
        ],
      },
      size: {
        sm: ['px-3', 'py-1.5', 'text-xs'],
        md: ['px-4', 'py-2', 'text-sm'],
        lg: ['px-5', 'py-2.5', 'text-sm'],
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      disabled: false,
    },
  },
)

type ButtonProps = VariantProps<typeof button>

withDefaults(
  defineProps<{
    intent?: ButtonProps['intent']
    size?: ButtonProps['size']
  }>(),
  {
    intent: 'primary',
    size: 'md',
    disabled: false,
  },
)
</script>

<template>
  <button
    :class="
      button({
        intent,
        size,
        disabled: !!$attrs['disabled'],
      })
    "
    :disabled="!!$attrs['disabled']"
  >
    <slot />
  </button>
</template>
