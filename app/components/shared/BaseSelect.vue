<script lang="ts" setup>
import { cva, type VariantProps } from 'class-variance-authority'

defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ required: true })

const select = cva(
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
    'disabled:bg-surface-hover',
    'disabled:text-ink-2',
    'disabled:cursor-default',
    'appearance-none',
    'bg-no-repeat',
    'bg-size-[1rem]',
    'bg-position-[right_0.75rem_center]',
    'pr-9',
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

type SelectProp = VariantProps<typeof select>

const props = withDefaults(
  defineProps<{
    id: string
    label?: string
    placeholder?: string
    intent?: SelectProp['intent']
    errorMsg?: string
    options: { value: string, label: string }[]
    disabled?: boolean
    reserveError?: boolean
  }>(),
  {
    label: '',
    placeholder: '',
    intent: 'primary',
    errorMsg: '',
    disabled: false,
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
    <select
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :disabled="disabled"
      :class="select({ intent })"
      :aria-invalid="showError ? true : undefined"
      :aria-describedby="showError ? `${id}-error` : undefined"
      style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E&quot;)"
    >
      <option
        v-if="placeholder"
        disabled
        value=""
      >
        {{ placeholder }}
      </option>
      <option
        v-for="opt in options"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>
    <p
      v-if="showErrorSlot"
      :id="`${id}-error`"
      class="mt-1 text-xs/snug min-h-5 line-clamp-2"
      :class="showError ? 'text-red-500' : 'invisible'"
      aria-live="polite"
    >
      {{ errorMsg || '\u00a0' }}
    </p>
  </div>
</template>
