<script setup lang="ts">
import BaseButton from "~/components/shared/BaseButton.vue";
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
//TODO:Create a BaseButton

const dynamicNav = computed(() => {
  const activeStep = props.totalSteps.find(
    (onboardStep) => onboardStep.active === true,
  );
  return activeStep?.step === 1 ? "Skip for now" : "Back";
});

const backButtonIntent = computed(() => {
  return dynamicNav.value === "Back" ? "secondary" : "ghost";
});
</script>

<template>
  <div class="mt-20 flex justify-between items-center">
    <BaseButton :intent="backButtonIntent" @click="handleBack">
      <span v-if="dynamicNav === 'Back'" class="inline-block">
        <BaseIcon name="leftArrow" />
      </span>
      <div class="text-neutral-600 text-base">
        {{ dynamicNav }}
      </div>
    </BaseButton>

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
      <BaseButton @click="handleContinue">
        Continue <BaseIcon name="rightArrow" size="1.5em" />
      </BaseButton>
    </div>
  </div>
</template>
