<script setup lang="ts">
import OnboardNav from "@/components/onboard/shared/OnboardNav.vue";
definePageMeta({ layout: "onboard" });

const { currentPage, onboardPage, bumpStep, backStep, updateOnboardPage } =
  useOnboard();

updateOnboardPage();
</script>

<template>
  <component :is="currentPage" />
  <OnboardNav
    :total-steps="onboardPage"
    @next-page="bumpStep"
    @back-page="backStep"
  />
</template>
