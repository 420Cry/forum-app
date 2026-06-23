<script setup lang="ts">
import OnboardNav from "@/components/onboard/shared/OnboardNav.vue";
import OnboardProgress from "@/components/onboard/shared/OnboardProgress.vue";

definePageMeta({ layout: "onboard" });

const { currentPage, currentStep, currentStepLabel, onboardPage, bumpStep, backStep, updateOnboardPage } =
  useOnboard();

const totalSteps = onboardPage.value.length;

updateOnboardPage();
</script>

<template>
  <OnboardProgress
    :step="currentStep"
    :total-steps="totalSteps"
    :label="currentStepLabel"
  />
  <component :is="currentPage" />
  <OnboardNav
    :current-step="currentStep"
    :total-steps="totalSteps"
    @next-page="bumpStep"
    @back-page="backStep"
  />
</template>
