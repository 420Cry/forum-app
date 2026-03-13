<script setup lang="ts">
import BaseIcon from "~/components/shared/BaseIcon.vue";
const emit = defineEmits(["next-page", "back-page"]);

interface onboardStepProp {
  step: number;
  active: boolean;
}

const props = defineProps<{ totalSteps: onboardStepProp[] }>();

const baseClass = "w-[30px] h-[6px] rounded-lg";

const handleContinue = () => {
  emit("next-page");
};

const handleBack = () => {
  emit("back-page");
};
//TODO: Create a BaseButton

const dynamicNav = computed(() => {
  const activeStep = props.totalSteps.find(
    (onboardStep) => onboardStep.active === true,
  );
  return activeStep?.step === 1 ? "Skip for now" : "Back";
});

const backButtonClass = computed(() => {
  const baseClass =
    "flex px-4 py-2 gap-1 justify-center items-center rounded-lg bg-primary-200 font-semibold md:px-10";

  return dynamicNav.value === "Back" ? baseClass : "";
});
</script>

<template>
  <div class="mt-20 flex justify-between items-center">
    <button :class="backButtonClass" @click="handleBack">
      <span v-if="dynamicNav === 'Back'" class="inline-block">
        <BaseIcon name="leftArrow" />
      </span>
      <div class="text-neutral-600 text-xs md:text-lg">
        {{ dynamicNav }}
      </div>
    </button>

    <div class="flex gap-1">
      <div
        v-for="onboardStep in props.totalSteps"
        :key="onboardStep.step"
        :class="
          onboardStep.active
            ? `${baseClass} bg-primary-900`
            : `${baseClass} bg-neutral-300`
        "
      />
    </div>

    <div>
      <button
        class="bg-primary-900 px-4 py-2 rounded-lg text-neutral-100 font-semibold flex items-center gap-1 text-xs md:text-[16px] md:px-10"
        @click="handleContinue"
      >
        Continue <BaseIcon name="rightArrow" size="1.5em" />
      </button>
    </div>
  </div>
</template>
