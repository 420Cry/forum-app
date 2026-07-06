<script lang="ts" setup>
import { cva, type VariantProps } from 'class-variance-authority'

const model = defineModel<string | number>({ required: true })

type formProp = {
  label?: string
  placeholder?: string
  intent?: InputProp['intent']
  errorMsg?: string
  id: string
}

const input = cva(
  [
    'bg-card',
    'border',
    'rounded-md',
    'py-2.5',
    'px-3',
    'text-ink',
    'text-sm',
    'w-full',
    'outline-none',
    'transition-colors',
    'placeholder:text-ink-4',
  ],
  {
    variants: {
      intent: {
        primary: [
          'border-line',
          'focus:border-brand',
          'focus:ring-2',
          'focus:ring-brand/20',
        ],
        error: [
          'border-red-500',
          'focus:border-red-500',
          'focus:ring-2',
          'focus:ring-red-500/20',
        ],
      },
    },
  },
)

type InputProp = VariantProps<typeof input>
withDefaults(defineProps<formProp>(), {
  label: '',
  placeholder: '',
  intent: 'primary',
  errorMsg: '',
})
</script>

<template>
  <label
    class="block text-sm font-semibold text-ink-2 mb-1"
    :for="id"
  >{{ label }}</label>
  <input
    v-bind="$attrs"
    :id="id"
    v-model="model"
    :placeholder="placeholder"
    :class="input({ intent })"
  />
  <p
    v-if="intent !== 'primary'"
    class="mt-1 text-xs text-red-500"
  >
    {{ errorMsg }}
  </p>
</template>
