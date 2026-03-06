<script setup lang="ts">
import { computed } from "vue";
import BaseIcon from "../shared/BaseIcon.vue";
import type { iconNameType } from "~/types/iconType";

type propsType = {
  iconName: iconNameType;
  title: string;
  description: string;
  size?: string;
  class?: string;
  active: boolean;
};

const props = withDefaults(defineProps<propsType>(), {
  size: "2.5em",
  class: "text-primary-900",
});

const computedIconClass = computed(() => {
  return "stroke-[10px] " + props.class;
});

const computedCardClass = computed(() => {
  const baseClass =
    "max-w-80.5 w-full border-2  rounded-2xl p-5 flex flex-col gap-4 hover:bg-primary-100 hover:border-primary-900 transition duration-100 ease-in-out md:max-w-120";

  const inactiveClass = baseClass + " bg-white border-neutral-300";
  const activeClass = baseClass + " bg-primary-100 border-primary-900";

  return props.active ? activeClass : inactiveClass;
});
</script>

<template>
  <div :class="computedCardClass">
    <div class="flex justify-center">
      <div
        class="p-4 bg-primary-200 border-radius rounded-full flex justify-center items-center"
      >
        <BaseIcon
          :name="iconName"
          :class="computedIconClass"
          :size="props.size"
        />
      </div>
    </div>
    <div>
      <h3 class="font-semibold text-center mb-2 text-neutral-900">
        {{ props.title }}
      </h3>
      <h4 class="text-center text-[14px] text-neutral-600">
        {{ props.description }}
      </h4>
    </div>
  </div>
</template>
