<script setup lang="ts">
import BaseInput from '../shared/BaseInput.vue'
import BaseButton from '../shared/BaseButton.vue'
import BaseIcon from '../shared/BaseIcon.vue'
import LocationAutocomplete from '../shared/LocationAutocomplete.vue'
import OccupationAutocomplete from '../shared/OccupationAutocomplete.vue'
import TitleSection from './shared/TitleSection.vue'
import { sanitizePersonName } from '~/utils/onboardInput'
import {
  dateOfBirthFieldError,
  maxDateOfBirthInput,
  minDateOfBirthInput,
} from '~/utils/dateOfBirth'
import { useAvatarUpload } from '~/composables/media/useAvatarUpload'
import { useCatalogApi } from '~/composables/api/useCatalogApi'

const { t } = useI18n()
const toast = useToast()
const { onboardInfo, infoErrors, clearInfoError, setInfoError, flushDraft } = useOnboard()
const { uploadAvatar } = useAvatarUpload()
const { fetchTags } = useCatalogApi()

const avatarFailed = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const catalogsLoading = ref(true)

onMounted(async () => {
  try {
    const [locations, occupations] = await Promise.all([
      fetchTags('location').catch(() => []),
      fetchTags('occupation').catch(() => []),
    ])
    if (onboardInfo.location && !onboardInfo.locationName) {
      const match = locations.find(tag => tag.key === onboardInfo.location)
      if (match) onboardInfo.locationName = match.name
    }
    if (onboardInfo.occupation && !onboardInfo.occupationName) {
      const match = occupations.find(tag => tag.key === onboardInfo.occupation)
      if (match) onboardInfo.occupationName = match.name
    }
  }
  finally {
    catalogsLoading.value = false
  }
})

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

const dobMin = minDateOfBirthInput()
const dobMax = maxDateOfBirthInput()

function validateDateOfBirth(raw = onboardInfo.dateOfBirth) {
  const message = dateOfBirthFieldError(raw, t)
  if (message) {
    setInfoError('dateOfBirth', message)
    return false
  }
  clearInfoError('dateOfBirth')
  return true
}

function onDateOfBirthInput(event: Event) {
  const el = event.target as HTMLInputElement
  onboardInfo.dateOfBirth = el.value
  if (el.value.length >= 10) validateDateOfBirth(el.value)
  else clearInfoError('dateOfBirth')
}

function onDateOfBirthBlur(event: Event) {
  const el = event.target as HTMLInputElement
  if (el.value) validateDateOfBirth(el.value)
}

function onLocationSearchError(message: string) {
  toast.showError(message, 3000)
}

function onOccupationSearchError(message: string) {
  toast.showError(message, 3000)
}

async function onPickAvatar(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  uploading.value = true
  try {
    const url = await uploadAvatar(file)
    onboardInfo.avatarUrl = url
    avatarFailed.value = false
    void flushDraft()
  }
  catch (err: unknown) {
    const msg
      = err && typeof err === 'object' && 'statusMessage' in err
        ? String((err as { statusMessage?: string }).statusMessage)
        : t('settings.error.avatar_upload')
    toast.showError(msg, 3000)
  }
  finally {
    uploading.value = false
  }
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
    class="mx-auto w-full max-w-190 rounded-md border border-line bg-card px-8 py-7 shadow-1"
  >
    <div class="mb-6.5 flex items-center gap-5.5">
      <img
        v-if="onboardInfo.avatarUrl && !avatarFailed"
        :src="onboardInfo.avatarUrl"
        class="size-24 flex-none rounded-full border border-line object-cover"
        @error="avatarFailed = true"
      >
      <div
        v-else
        class="flex size-24 flex-none items-center justify-center rounded-full border-2 border-dashed border-line-2 bg-surface-hover text-ink-4"
      >
        <BaseIcon
          name="camera"
          size="2em"
        />
      </div>
      <div>
        <p class="mb-1 text-[12.5px] font-semibold text-ink-2">
          {{ t('onboard.heading.profile_photo') }}
        </p>
        <p class="text-[13.5px]/relaxed  text-ink-3">
          {{ t('onboard.info.profile_photo_help') }}
        </p>
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="hidden"
          @change="onPickAvatar"
        >
        <BaseButton
          intent="secondary"
          size="sm"
          class="mt-2"
          :disabled="uploading"
          @click="fileInput?.click()"
        >
          {{
            uploading
              ? t('settings.action.uploading')
              : t('onboard.action.upload_photo')
          }}
        </BaseButton>
      </div>
    </div>

    <div class="flex flex-col gap-5">
      <div class="grid grid-cols-2 gap-4.5">
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

      <div class="grid grid-cols-2 gap-4.5 items-start">
        <BaseInput
          id="dateOfBirth"
          v-model="onboardInfo.dateOfBirth"
          type="date"
          :label="t('onboard.label.date_of_birth')"
          :intent="infoErrors?.dateOfBirth ? 'error' : 'primary'"
          :error-msg="infoErrors?.dateOfBirth"
          :min="dobMin"
          :max="dobMax"
          autocomplete="bday"
          @input="onDateOfBirthInput"
          @blur="onDateOfBirthBlur"
        />
        <LocationAutocomplete
          id="location"
          v-model="onboardInfo.location"
          v-model:display-name="onboardInfo.locationName"
          :label="t('onboard.label.location')"
          :placeholder="t('onboard.label.location_placeholder')"
          :disabled="catalogsLoading"
          :intent="infoErrors?.location ? 'error' : 'primary'"
          :error-msg="infoErrors?.location"
          @change="clearInfoError('location')"
          @search-error="onLocationSearchError"
        />
      </div>

      <div class="flex flex-col gap-1">
        <OccupationAutocomplete
          id="occupation"
          v-model="onboardInfo.occupation"
          v-model:display-name="onboardInfo.occupationName"
          :label="t('onboard.label.occupation')"
          :placeholder="t('onboard.label.occupation_placeholder')"
          :disabled="catalogsLoading"
          :intent="infoErrors?.occupation ? 'error' : 'primary'"
          :error-msg="infoErrors?.occupation"
          @change="clearInfoError('occupation')"
          @search-error="onOccupationSearchError"
        />
        <p class="text-xs text-ink-4">
          {{ t('onboard.info.occupation_help') }}
        </p>
      </div>
    </div>
  </div>
</template>
