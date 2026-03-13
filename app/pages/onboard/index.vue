<script setup lang="ts">
import BasicInfo from "@/components/onboard/BasicInfo.vue";
import GoalSelection from "@/components/onboard/GoalSelection.vue";
import RoleSelection from "@/components/onboard/RoleSelection.vue";
import OnboardNav from "@/components/onboard/shared/OnboardNav.vue";

definePageMeta({ layout: "onboard" });

// TODO: Move to useOnboard composables
const onboardPage = shallowRef([
  {
    step: 1,
    pageName: RoleSelection,
  },
  {
    step: 2,
    pageName: GoalSelection,
  },
  {
    step: 3,
    pageName: BasicInfo,
  },
]);

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

const currentStep = ref(1);

const currentPage = computed(() => {
  const selectedPage = onboardPage.value.find(
    (page) => page.step === currentStep.value,
  );

  return selectedPage?.pageName;
});

const updateTotalStepsState = () => {
  const newTotalSteps = totalSteps.value.map((onboardStep) => {
    return onboardStep.step === currentStep.value
      ? { step: onboardStep.step, active: true }
      : { step: onboardStep.step, active: false };
  });
  totalSteps.value = newTotalSteps;
};
const bumpStep = () => {
  if (currentStep.value === onboardPage.value.length) {
    // TODO: Move to setup profile poge
    return;
  }
  currentStep.value++;
  updateTotalStepsState();
};

const backStep = () => {
  if (currentStep.value === 1) {
    // TODO: Skip for now
    currentStep.value++;
    updateTotalStepsState();
    return;
  }
  currentStep.value--;
  updateTotalStepsState();
};
</script>

<template>
  <component :is="currentPage" />
  <OnboardNav
    :total-steps="totalSteps"
    @next-page="bumpStep"
    @back-page="backStep"
  />
</template>
