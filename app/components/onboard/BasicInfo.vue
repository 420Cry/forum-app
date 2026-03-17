<script setup lang="ts">
import TitleSection from "./shared/TitleSection.vue";
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
        <label class="font-semibold" for="fullname">Fullname</label>
        <input
          id="fullname"
          type="text"
          name="fullname"
          placeholder="eg. Nghia Truong"
          class="bg-white py-3 px-4 rounded-lg outline-2 outline-neutral-300 focus:outline-primary-300"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-semibold" for="dateofbirth">Date of Birth</label>
        <input
          id="fullname"
          type="text"
          name="fullname"
          placeholder="DD/MM/YY"
          class="bg-white py-3 px-4 rounded-lg outline-2 outline-neutral-300 focus:outline-primary-300"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="font-semibold" for="occupation">Occupation</label>
        <input
          id="occupation"
          type="text"
          name="occupation"
          placeholder="eg. Architect"
          class="bg-white py-3 px-4 rounded-lg outline-2 outline-neutral-300 focus:outline-primary-300"
        />
      </div>
    </form>
  </div>
</template>

