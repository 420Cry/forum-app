<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

//TODO: Create button design system
const button = cva(
  ["font-semibold", "flex", "gap-1", "items-center", "rounded-lg"],
  {
    variants: {
      intent: {
        primary: ["bg-primary-900", "text-neutral-100"],
        secondary: ["bg-primary-200", "text-neutral-600"],
        outline: ["outline-primary-900", "text-neutral-600"],
        ghost: ["hover:bg-primary-200", "transition", "ease-in-out"],
      },
      size: {
        small: ["px-2", "py-1", "md:px-4"],
        medium: ["px-4", "py-2", "md:px-6", "md:text-base"],
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "small",
      disabled: false,
    },
  },
);

type ButtonProps = VariantProps<typeof button>;

withDefaults(
  defineProps<{
    intent?: ButtonProps["intent"];
    size?: ButtonProps["size"];
  }>(),
  {
    intent: "primary",
    size: "medium",
    disabled: false,
  },
);
</script>

<template>
  <button
    :class="
      button({
        intent,
        size,
        disabled: typeof $attrs['disabled'] !== 'undefined',
      })
    "
    :disabled="typeof $attrs['disabled'] !== 'undefined'"
  >
    <slot />
  </button>
</template>
