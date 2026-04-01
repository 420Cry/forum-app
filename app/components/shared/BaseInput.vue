<script lang="ts" setup>
import { cva, type VariantProps } from "class-variance-authority";

const model = defineModel<string | number>({ required: true });

type formProp = {
  label?: string;
  placeholder?: string;
  intent?: InputProp["intent"];
  errorMsg?: string;
  id: string;
};

const input = cva(["bg-white", "py-3", "px-4", "rounded-lg", "outline-2"], {
  variants: {
    intent: {
      primary: ["outline-neutral-300", "focus:outline-primary-300"],
      error: ["outline-red-500"],
    },
  },
});

type InputProp = VariantProps<typeof input>;
withDefaults(defineProps<formProp>(), {
  label: "",
  placeholder: "",
  intent: "primary",
  errorMsg: "",
});
</script>
<template>
  <label class="font-semibold" :for="id">{{ label }}</label>
  <input
    v-bind="$attrs"
    :id="id"
    v-model="model"
    :placeholder="placeholder"
    :class="input({ intent })"
  />
  <p v-if="intent !== 'primary'" class="text-red-500">
    {{ errorMsg }}
  </p>
</template>
