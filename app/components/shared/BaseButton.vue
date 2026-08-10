<script setup lang="ts">
import {
  buttonClass,
  type ButtonIntent,
  type ButtonSize,
} from '~/utils/buttonClass'

withDefaults(
  defineProps<{
    intent?: ButtonIntent
    size?: ButtonSize
    block?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    intent: 'primary',
    size: 'md',
    block: false,
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClass({ intent, size, block })"
  >
    <slot />
  </button>
</template>
