<script setup lang="ts">
import BaseInput from '../shared/BaseInput.vue'
import BaseButton from '../shared/BaseButton.vue'
import BaseIcon from '../shared/BaseIcon.vue'
import TitleSection from './shared/TitleSection.vue'
import { sanitizeAgeInput, sanitizePersonName } from '~/utils/onboardInput'

const { t } = useI18n()
const { onboardInfo, infoErrors, clearInfoError } = useOnboard()

function onFirstNameInput(event: Event) {
  const el = event.target as HTMLInputElement
  const next = sanitizePersonName(el.value)
  if (next !== el.value) el.value = next
  onboardInfo.firstName = next
  clearInfoError('firstName')
}

function onLastNameInput(event: Event) {
  const el = event.target as HTMLInputElement
  const next = sanitizePersonName(el.value)
  if (next !== el.value) el.value = next
  onboardInfo.lastName = next
  clearInfoError('lastName')
}

function onAgeInput(event: Event) {
  const el = event.target as HTMLInputElement
  const next = sanitizeAgeInput(el.value)
  if (next !== el.value) el.value = next
  onboardInfo.age = next
  clearInfoError('age')
}
</script>

<template>
  <TitleSection>
    <template #title>
      {{ t('onboard.heading.about_yourself') }}
    </template>
    <template #subtitle>
      {{ t('onboard.info.about_subtitle') }}
    </template>
  </TitleSection>

  <div
    class="mx-auto w-full max-w-[760px] bg-card border border-line rounded-md shadow-1 px-8 py-7"
  >
    <div class="flex items-center gap-[22px] mb-[26px]">
      <div
        class="size-24  rounded-full border-2 border-dashed border-line-2 bg-surface-hover flex items-center justify-center text-ink-4 flex-none"
      >
        <BaseIcon
          name="camera"
          size="2em"
        />
      </div>
      <div>
        <p class="text-[12.5px] font-semibold text-ink-2 mb-1">
          {{ t('onboard.heading.profile_photo') }}
        </p>
        <p class="text-[13.5px] text-ink-3 leading-relaxed">
          {{ t('onboard.info.profile_photo_help') }}
        </p>
        <BaseButton
          intent="secondary"
          size="sm"
          class="mt-2"
        >
          {{ t('onboard.action.upload_photo') }}
        </BaseButton>
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <div class="grid grid-cols-2 gap-[18px]">
        <div class="flex flex-col gap-1">
          <BaseInput
            id="firstName"
            v-model="onboardInfo.firstName"
            :label="t('onboard.label.first_name')"
            :placeholder="t('onboard.label.first_name_placeholder')"
            :intent="infoErrors?.firstName ? 'error' : 'primary'"
            :error-msg="infoErrors?.firstName"
            autocomplete="given-name"
            @input="onFirstNameInput"
          />
        </div>
        <div class="flex flex-col gap-1">
          <BaseInput
            id="lastName"
            v-model="onboardInfo.lastName"
            :label="t('onboard.label.last_name')"
            :placeholder="t('onboard.label.last_name_placeholder')"
            :intent="infoErrors?.lastName ? 'error' : 'primary'"
            :error-msg="infoErrors?.lastName"
            autocomplete="family-name"
            @input="onLastNameInput"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-[18px]">
        <div class="flex flex-col gap-1">
          <BaseInput
            id="age"
            v-model="onboardInfo.age"
            :label="t('onboard.label.age')"
            :placeholder="t('onboard.label.age_placeholder')"
            :intent="infoErrors?.age ? 'error' : 'primary'"
            :error-msg="infoErrors?.age"
            inputmode="numeric"
            autocomplete="off"
            @input="onAgeInput"
          />
        </div>
        <div class="flex flex-col gap-1">
          <BaseInput
            id="location"
            v-model="onboardInfo.location"
            :label="t('onboard.label.location')"
            :placeholder="t('onboard.label.location_placeholder')"
            :intent="infoErrors?.location ? 'error' : 'primary'"
            :error-msg="infoErrors?.location"
            @input="clearInfoError('location')"
          />
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <BaseInput
          id="occupation"
          v-model="onboardInfo.occupation"
          :label="t('onboard.label.occupation')"
          :placeholder="t('onboard.label.occupation_placeholder')"
          :intent="infoErrors?.occupation ? 'error' : 'primary'"
          :error-msg="infoErrors?.occupation"
          @input="clearInfoError('occupation')"
        />
        <p class="text-xs text-ink-4 mt-1">
          {{ t('onboard.info.occupation_help') }}
        </p>
      </div>
    </div>
  </div>
</template>
