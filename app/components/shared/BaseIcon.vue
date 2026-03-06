<script setup lang="ts">
import { iconList } from "~/constants/iconList";
import type { iconNameType } from "~/types/iconType";

type iconPropsType = {
  name: iconNameType;
  size?: string;
  class?: string;
};

const props = withDefaults(defineProps<iconPropsType>(), {
  class: "",
  size: "1em",
});

const computedClass = computed<string>(() => {
  return "stroke-[10px] " + props.class;
});
</script>

<template>
  <Icon
    :name="iconList[props.name]"
    :class="computedClass"
    :size="props.size"
  />
</template>
