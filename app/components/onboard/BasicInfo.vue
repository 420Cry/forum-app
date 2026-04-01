<script setup lang="ts">
import BaseInput from "../shared/BaseInput.vue";
import TitleSection from "./shared/TitleSection.vue";

const { onboardInfo } = useOnboard();
</script>
<template>
  <TitleSection>
    <template #title> Tell us a bit about yourself </template>
    <template #subtitle
      >Help us personalize your profile <br />
      and connect you with the right people.
    </template>
  </TitleSection>

  <div class="m-auto max-w-133 mt-8">
    <form class="p-2 flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <BaseInput
          id="fullname"
          v-model="onboardInfo.fullname"
          label="Fullname"
          placeholder="eg. Nghia Truong"
          error-msg="Wrong fullname"
        />
      </div>
      <div class="flex flex-col gap-2">
        <BaseInput
          id="dob"
          v-model="onboardInfo.dob"
          type="date"
          label="Date of Birth"
          placeholder="DD/MM/YY"
        />
      </div>
      <div class="flex flex-col gap-2">
        <BaseInput
          id="occupation"
          v-model="onboardInfo.occupation"
          label="Occupation"
          placeholder="eg. Architect"
        />
      </div>
    </form>
  </div>
</template>
