<script setup lang="ts">
import BaseIcon from "~/components/shared/BaseIcon.vue";
const emit = defineEmits(["next-page"]);

const totalSteps = ref([
  {
    step: 1,
    active: true,
  },
  {
    step: 2,
    active: false,
  },
  {
    step: 3,
    active: false,
  },
]);

const baseClass = "w-[30px] h-[6px] rounded-lg";

const handleContinue = () => {
  emit("next-page");
};
</script>

<template>
  <div class="mt-20 flex justify-between items-center">
    <div>
      <slot>Skip for now</slot>
    </div>

    <div class="flex gap-1">
      <div
        v-for="step in totalSteps"
        :class="
          step.active
            ? `${baseClass} bg-primary-900`
            : `${baseClass} bg-neutral-300`
        "
      ></div>
    </div>

    <div>
      <button
        class="bg-primary-900 px-4 py-2 rounded-lg text-neutral-100 font-semibold flex items-center gap-1"
        @click="handleContinue"
      >
        Continue <BaseIcon name="rightArrow" size="1.5em" />
      </button>
    </div>
  </div>
</template>
