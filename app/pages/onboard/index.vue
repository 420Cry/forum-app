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

  <main class="flex-1 flex flex-col items-center px-8 pt-14 pb-10">
    <component :is="currentPage" />
  </main>

  <OnboardNav
    :current-step="currentStep"
    :total-steps="totalSteps"
    @next-page="bumpStep"
    @back-page="backStep"
  />
</template>
