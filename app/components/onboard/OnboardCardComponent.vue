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
  variants: "roles" | "goals";
};

const props = withDefaults(defineProps<propsType>(), {
  size: "2.5em",
  class: "text-primary-900",
});

const computedIconClass = computed(() => {
  return "stroke-[10px] " + props.class;
});

const computedCardClass = computed(() => {
  return [
    "max-w-80.5 w-full border-2 relative rounded-2xl p-5 flex flex-col gap-4 hover:bg-primary-100 hover:border-primary-900 transition duration-100 ease-in-out cursor-pointer md:max-w-90 lg:max-w-95",
    {
      "bg-white border-neutral-300": !props.active,
      "bg-primary-100 border-primary-900": props.active,
    },
  ];
});

const baseMainIconClass = "flex";
const baseIconWrapper = "bg-primary-200 flex items-center justify-center";
const baseTitleClass = "font-semibold mb-2 text-neutral-900";
const baseSubtitleClass = " max-w-80 text-[14px] text-neutral-600";
const baseTextWrapperClass = "flex flex-col justify-center ";
const variantClasses = {
  mainIconClass:
    baseMainIconClass + (props.variants === "roles" ? " justify-center" : ""),
  iconWrapper:
    baseIconWrapper +
    (props.variants === "roles" ? " p-4 rounded-full" : " p-3 rounded-lg"),
  titleClass:
    baseTitleClass + (props.variants === "roles" ? " text-center" : ""),
  subtitleClass:
    baseSubtitleClass + (props.variants === "roles" ? " text-center" : ""),
  textWrapperClass:
    baseTextWrapperClass + (props.variants === "roles" ? " items-center" : ""),
};
</script>

<template>
  <div :class="computedCardClass">
    <div
      v-show="props.active"
      class="absolute right-6 bg-primary-900 flex justify-center p-1 rounded-full"
    >
      <BaseIcon name="checkMark" size="1.5em" class="text-neutral-100" />
    </div>

    <div :class="variantClasses.mainIconClass">
      <div :class="variantClasses.iconWrapper">
        <BaseIcon
          :name="iconName"
          :class="computedIconClass"
          :size="props.size"
        />
      </div>
    </div>

    <div :class="variantClasses.textWrapperClass">
      <h3 :class="variantClasses.titleClass">
        {{ props.title }}
      </h3>
      <h4 :class="variantClasses.subtitleClass">
        {{ props.description }}
      </h4>
    </div>
  </div>
</template>
