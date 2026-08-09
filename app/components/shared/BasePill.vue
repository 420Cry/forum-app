<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'
import {
  STARTUP_STAGE_LABELS,
  type PillVariant,
  type StartupStage,
} from '~/utils/stagePill'

const pill = cva(
  [
    'inline-flex',
    'items-center',
    'rounded-pill',
    'whitespace-nowrap',
    'font-semibold',
    'text-[11px]',
    'leading-none',
    'px-[9px]',
    'py-1',
  ],
  {
    variants: {
      variant: {
        base: ['bg-stage-idea-bg', 'text-stage-idea-fg'],
        pre_seed: ['bg-stage-preseed-bg', 'text-stage-preseed-fg'],
        seed: ['bg-stage-seed-bg', 'text-stage-seed-fg'],
        series_a: ['bg-stage-seriesa-bg', 'text-stage-seriesa-fg'],
        growth: ['bg-stage-growth-bg', 'text-stage-growth-fg'],
        scale: ['bg-stage-scale-bg', 'text-stage-scale-fg'],
        exit: ['bg-stage-idea-bg', 'text-stage-idea-fg'],
        investor: ['bg-stage-investor-bg', 'text-stage-investor-fg'],
        opportunity: [
          'bg-accent-soft',
          'text-accent-text',
          'uppercase',
          'tracking-[0.06em]',
          'text-[10px]',
        ],
      },
    },
    defaultVariants: {
      variant: 'base',
    },
  },
)

type CvaVariant = NonNullable<VariantProps<typeof pill>['variant']>

const props = withDefaults(
  defineProps<{
    variant?: Exclude<PillVariant, never> | undefined
  }>(),
  {
    variant: undefined,
  },
)

const resolvedVariant = computed<CvaVariant>(() => props.variant ?? 'base')

const defaultLabel = computed(() => {
  if (props.variant === 'investor') return 'Investor'
  if (props.variant && props.variant in STARTUP_STAGE_LABELS) {
    return STARTUP_STAGE_LABELS[props.variant as StartupStage]
  }
  return undefined
})
</script>

<template>
  <span :class="pill({ variant: resolvedVariant })">
    <slot>{{ defaultLabel }}</slot>
  </span>
</template>
