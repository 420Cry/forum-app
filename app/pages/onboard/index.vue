<script setup lang="ts">
import BasicInfo from "@/components/onboard/BasicInfo.vue";
import GoalSelection from "@/components/onboard/GoalSelection.vue";
import RoleSelection from "@/components/onboard/RoleSelection.vue";
import OnboardNav from "@/components/onboard/shared/OnboardNav.vue";

definePageMeta({ layout: "onboard" });

// TODO: Move to useOnboard composables
// TODO: currentStep controls onboardNav's indicator
const onboardPage = shallowRef([
  {
    step: 1,
    pageName: RoleSelection,
  },
  {
    step: 2,
    pageName: BasicInfo,
  },
  {
    step: 3,
    pageName: GoalSelection,
  },
]);

const currentStep = ref(1);

const currentPage = computed(() => {
  const selectedPage = onboardPage.value.find(
    (page) => page.step === currentStep.value,
  );

  return selectedPage?.pageName;
});

const bumpStep = () => {
  currentStep.value++;
};
</script>

<template>
  <component :is="currentPage" />
  <OnboardNav @next-page="bumpStep" />
</template>
