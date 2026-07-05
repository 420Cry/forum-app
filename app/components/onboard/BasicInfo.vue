<script setup lang="ts">
import BaseInput from '../shared/BaseInput.vue'
import BaseButton from '../shared/BaseButton.vue'
import BaseIcon from '../shared/BaseIcon.vue'
import TitleSection from './shared/TitleSection.vue'

const { onboardInfo, infoErrors, clearInfoError } = useOnboard()
</script>

<template>
  <TitleSection>
    <template #title>
      Tell us about yourself
    </template>
    <template #subtitle>
      A few quick details. This is how others will see you across Fundedr.
    </template>
  </TitleSection>

  <div
    class="mx-auto w-full max-w-[760px] bg-card border border-line rounded-[var(--radius-md)] shadow-[var(--shadow-1)] px-8 py-7"
  >
    <!-- Photo upload -->
    <div class="flex items-center gap-[22px] mb-[26px]">
      <div
        class="w-24 h-24 rounded-full border-2 border-dashed border-line-2 bg-surface-hover flex items-center justify-center text-ink-4 flex-none"
      >
        <BaseIcon
          name="camera"
          size="2em"
        />
      </div>
      <div>
        <p class="text-[12.5px] font-semibold text-ink-2 mb-1">
          Profile photo
        </p>
        <p class="text-[13.5px] text-ink-3 leading-relaxed">
          A clear headshot helps people recognise you. JPG or PNG, up to 5 MB.
        </p>
        <BaseButton
          intent="secondary"
          size="sm"
          class="mt-2"
        >
          Upload photo
        </BaseButton>
      </div>
    </div>

    <!-- Form fields -->
    <div class="flex flex-col gap-5">
      <!-- Row 1: First + Last name -->
      <div class="grid grid-cols-2 gap-[18px]">
        <div class="flex flex-col gap-1">
          <BaseInput
            id="firstName"
            v-model="onboardInfo.firstName"
            label="First name"
            placeholder="e.g. Dao"
            :intent="infoErrors?.firstName ? 'error' : 'primary'"
            :error-msg="infoErrors?.firstName"
            @input="clearInfoError('firstName')"
          />
        </div>
        <div class="flex flex-col gap-1">
          <BaseInput
            id="lastName"
            v-model="onboardInfo.lastName"
            label="Last name"
            placeholder="e.g. Nguyen"
            :intent="infoErrors?.lastName ? 'error' : 'primary'"
            :error-msg="infoErrors?.lastName"
            @input="clearInfoError('lastName')"
          />
        </div>
      </div>

      <!-- Row 2: Age + Location -->
      <div class="grid grid-cols-2 gap-[18px]">
        <div class="flex flex-col gap-1">
          <BaseInput
            id="age"
            v-model="onboardInfo.age"
            label="Age"
            placeholder="e.g. 28"
            :intent="infoErrors?.age ? 'error' : 'primary'"
            :error-msg="infoErrors?.age"
            @input="clearInfoError('age')"
          />
        </div>
        <div class="flex flex-col gap-1">
          <BaseInput
            id="location"
            v-model="onboardInfo.location"
            label="Location"
            placeholder="City, country"
            :intent="infoErrors?.location ? 'error' : 'primary'"
            :error-msg="infoErrors?.location"
            @input="clearInfoError('location')"
          />
        </div>
      </div>

      <!-- Row 3: Occupation (full width) -->
      <div class="flex flex-col gap-1">
        <BaseInput
          id="occupation"
          v-model="onboardInfo.occupation"
          label="Occupation"
          placeholder="e.g. Founder & researcher"
          :intent="infoErrors?.occupation ? 'error' : 'primary'"
          :error-msg="infoErrors?.occupation"
          @input="clearInfoError('occupation')"
        />
        <p class="text-xs text-ink-4 mt-1">
          This appears under your name on your profile and posts.
        </p>
      </div>
    </div>
  </div>
</template>
