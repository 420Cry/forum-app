<script setup>
import CardSection from "~/components/onboard/CardSection.vue";

definePageMeta({ layout: "onboard" });
</script>

<template>
  <div class="mb-10">
    <h1 class="text-neutral-900 text-center text-[18px] font-bold mb-2">
      What is your role on Fundedr?
    </h1>
    <h2 class="text-neutral-600 text-center text-[12px] font-medium">
      Choose the role that best describes your intent.
    </h2>
  </div>

  <CardSection />
</template>
