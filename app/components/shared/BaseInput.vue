<script lang="ts" setup>
import { cva, type VariantProps } from 'class-variance-authority'

defineOptions({ inheritAttrs: false })

const model = defineModel<string | number>({ required: true })

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
    'disabled:bg-surface-hover',
    'disabled:text-ink-2',
    'disabled:cursor-default',
    'disabled:focus:ring-0',
    'disabled:focus:border-line',
    'read-only:bg-surface-hover',
    'read-only:text-ink-2',
    'read-only:cursor-default',
    'read-only:focus:ring-0',
    'read-only:focus:border-line',
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

const props = withDefaults(
  defineProps<{
    label?: string
    placeholder?: string
    intent?: InputProp['intent']
    errorMsg?: string
    id: string
    /** Controls empty error-line reservation. Defaults to labeled fields. */
    reserveError?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    intent: 'primary',
    errorMsg: '',
  },
)

const showError = computed(
  () => props.intent === 'error' && !!props.errorMsg,
)
const showErrorSlot = computed(() => {
  if (showError.value) return true
  if (props.reserveError !== undefined) return props.reserveError
  return !!props.label
})
</script>

<template>
  <div class="min-w-0 flex flex-col">
    <label
      v-if="label"
      class="block text-sm font-semibold text-ink-2 mb-1"
      :for="id"
    >{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      v-model="model"
      :placeholder="placeholder"
      :class="input({ intent })"
      :aria-invalid="showError ? true : undefined"
      :aria-describedby="showError ? `${id}-error` : undefined"
    />
    <p
      v-if="showErrorSlot"
      :id="`${id}-error`"
      class="mt-1 text-xs/snug  min-h-5 line-clamp-2"
      :class="showError ? 'text-red-500' : 'invisible'"
      aria-live="polite"
    >
      {{ errorMsg || '\u00a0' }}
    </p>
  </div>
</template>
