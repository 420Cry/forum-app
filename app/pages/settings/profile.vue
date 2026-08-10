<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import LocationAutocomplete from '~/components/shared/LocationAutocomplete.vue'
import OccupationAutocomplete from '~/components/shared/OccupationAutocomplete.vue'
import SettingsBackLink from '~/components/settings/SettingsBackLink.vue'
import { useCatalogApi } from '~/composables/api/useCatalogApi'
import { useOnboardApi } from '~/composables/api/onboard/useOnboardApi'
import { useAvatarUpload } from '~/composables/media/useAvatarUpload'
import { useUserProfile } from '~/composables/user/useUserProfile'
import { createOnboardInfoSchema } from '~/types/onboard/schema/onboardInfoSchema'
import { sanitizePersonName } from '~/utils/onboardInput'
import {
  dateOfBirthFieldError,
  maxDateOfBirthInput,
  minDateOfBirthInput,
} from '~/utils/dateOfBirth'
import { useZodValidation } from '~/composables/validate/useZodValidation'
import { accountNamePrefix } from '~/utils/accountSummary'
import { getAvatarColor } from '~/utils/avatarColor'
import {
  locationCatalogLabel,
} from '~/utils/catalogLabel'
import { useOccupationLabels } from '~/composables/catalog/useOccupationLabels'

definePageMeta({ layout: 'home', access: 'protected' })

const { t, te, locale } = useI18n()
const toast = useToast()
const { profile, refreshProfile } = useUserProfile()
const { updateProfile } = useOnboardApi()
const { uploadAvatar } = useAvatarUpload()
const { fetchTags, clearCatalogCache } = useCatalogApi()
const { formInputValidate } = useZodValidation()
const { ensureLoaded, label: occupationLabelFn } = useOccupationLabels()

const editing = ref(false)
const firstName = ref('')
const lastName = ref('')
const dateOfBirth = ref('')
const location = ref('')
const locationName = ref('')
const occupation = ref('')
const occupationName = ref('')
const urlKey = ref('')
const profilePath = ref<string | null>(null)
const avatarUrl = ref<string | null>(null)
const avatarFailed = ref(false)
const errors = ref<Record<string, string> | null>(null)
const saving = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const locationLabels = ref<Map<string, string>>(new Map())
const dobMin = minDateOfBirthInput()
const dobMax = maxDateOfBirthInput()

const locationLabel = computed(() => {
  const key = location.value
  const fromMap = key ? locationLabels.value.get(key) : undefined
  const raw = locationName.value || fromMap || key || '—'
  if (!key || raw === '—') return raw
  return locationCatalogLabel(key, raw, t, te)
})
const occupationLabel = computed(() => {
  const key = occupation.value
  const raw = occupationName.value || (key ? occupationLabelFn(key, key) : '') || '—'
  if (!key || raw === '—') return raw
  return occupationLabelFn(key, raw)
})
const dateOfBirthLabel = computed(() => dateOfBirth.value || '—')

const displayName = computed(() => {
  const fromFields = `${firstName.value} ${lastName.value}`.trim()
  if (fromFields) return fromFields
  return profile.value?.profile?.name?.trim() || ''
})

const avatarInitials = computed(() => accountNamePrefix(displayName.value || '?'))
const avatarColor = computed(() =>
  getAvatarColor(profile.value?.id || displayName.value || 'user'),
)

function hydrate() {
  const p = profile.value?.profile
  if (!p) return
  const parts = (p.name ?? '').trim().split(/\s+/)
  firstName.value = parts[0] ?? ''
  lastName.value = parts.slice(1).join(' ')
  dateOfBirth.value = p.dateOfBirth ?? ''
  location.value = p.location ?? ''
  locationName.value
    = (p.location && locationLabels.value.get(p.location)) || ''
  occupation.value = p.occupation ?? ''
  occupationName.value
    = (p.occupation && occupationLabelFn(p.occupation, '')) || ''
  urlKey.value = p.urlKey ?? ''
  profilePath.value = p.profilePath
  avatarUrl.value = p.avatarUrl
  avatarFailed.value = false
}

onMounted(async () => {
  const [, locations] = await Promise.all([
    refreshProfile(),
    fetchTags('location').catch(() => []),
    ensureLoaded().catch(() => undefined),
  ])
  locationLabels.value = new Map(locations.map(tag => [tag.key, tag.name]))
  hydrate()
})

watch(locale, () => {
  void ensureLoaded()
})

function onLocationSearchError(message: string) {
  toast.showError(message, 3000)
}

function onOccupationSearchError(message: string) {
  toast.showError(message, 3000)
}

function startEditing() {
  hydrate()
  errors.value = null
  editing.value = true
}

function cancelEditing() {
  hydrate()
  errors.value = null
  editing.value = false
}

function onFirstNameInput(event: Event) {
  if (!editing.value) return
  const el = event.target as HTMLInputElement
  const next = sanitizePersonName(el.value)
  if (next !== el.value) el.value = next
  firstName.value = next
  clearError('firstName')
}

function onLastNameInput(event: Event) {
  if (!editing.value) return
  const el = event.target as HTMLInputElement
  const next = sanitizePersonName(el.value)
  if (next !== el.value) el.value = next
  lastName.value = next
  clearError('lastName')
}

function validateDateOfBirth(raw = dateOfBirth.value) {
  const message = dateOfBirthFieldError(raw, t)
  if (message) {
    errors.value = { ...(errors.value ?? {}), dateOfBirth: message }
    return false
  }
  clearError('dateOfBirth')
  return true
}

function onDateOfBirthInput(event: Event) {
  if (!editing.value) return
  const el = event.target as HTMLInputElement
  dateOfBirth.value = el.value
  if (el.value.length >= 10) validateDateOfBirth(el.value)
  else clearError('dateOfBirth')
}

function onDateOfBirthBlur(event: Event) {
  if (!editing.value) return
  const el = event.target as HTMLInputElement
  if (el.value) validateDateOfBirth(el.value)
}

function clearError(field: string) {
  if (!errors.value) return
  const { [field]: _, ...rest } = errors.value
  errors.value = Object.keys(rest).length > 0 ? rest : null
}

async function onPickAvatar(event: Event) {
  if (!editing.value) return
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  uploading.value = true
  try {
    const url = await uploadAvatar(file)
    await updateProfile({ avatarUrl: url })
    avatarUrl.value = url
    avatarFailed.value = false
    await refreshProfile(true)
    toast.showSuccess(t('settings.info.avatar_saved'), 2000)
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

async function onSave() {
  if (!editing.value) return
  const { data, errors: nextErrors } = formInputValidate(
    {
      firstName: firstName.value,
      lastName: lastName.value,
      dateOfBirth: dateOfBirth.value,
      location: location.value,
      occupation: occupation.value,
    },
    createOnboardInfoSchema(t),
  )
  if (nextErrors) {
    errors.value = nextErrors
    return
  }
  if (!urlKey.value.trim()) {
    errors.value = { urlKey: t('settings.error.slug_required') }
    return
  }
  errors.value = null
  saving.value = true
  try {
    await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      location: data.location,
      locationName: locationName.value || undefined,
      occupation: data.occupation,
      occupationName: occupationName.value || undefined,
      urlKey: urlKey.value.trim(),
    })
    if (data.location && locationName.value) {
      locationLabels.value.set(data.location, locationName.value)
    }
    clearCatalogCache()
    await refreshProfile(true)
    hydrate()
    editing.value = false
    toast.showSuccess(t('settings.info.profile_saved'), 2000)
  }
  catch (err: unknown) {
    const statusCode
      = err && typeof err === 'object' && 'statusCode' in err
        ? Number((err as { statusCode?: number }).statusCode)
        : 0
    const msg
      = err && typeof err === 'object' && 'statusMessage' in err
        ? String((err as { statusMessage?: string }).statusMessage)
        : t('common.error.try_again')
    if (statusCode === 409) {
      errors.value = { urlKey: t('settings.error.slug_taken') }
    }
    else if (statusCode === 400) {
      errors.value = { urlKey: t('settings.error.slug_format') }
    }
    toast.showError(msg || t('common.error.try_again'), 3000)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-190 mx-auto flex flex-col gap-4 pb-8">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <SettingsBackLink />
        <h1 class="text-[22px] font-bold text-ink tracking-[-0.02em]">
          {{ t('settings.heading.edit_profile') }}
        </h1>
        <p class="text-[14px] text-ink-3 mt-1.5 max-w-[52ch]">
          {{ t('settings.info.edit_profile') }}
        </p>
      </div>

      <div
        v-if="!editing"
        class="flex-none pt-8"
      >
        <BaseButton
          intent="primary"
          size="sm"
          @click="startEditing"
        >
          {{ t('settings.action.edit') }}
        </BaseButton>
      </div>
    </div>

    <section class="bg-card border border-line rounded-md shadow-1 px-6 py-5">
      <div class="flex items-start gap-5">
        <div class="flex-none">
          <img
            v-if="avatarUrl && !avatarFailed"
            :src="avatarUrl"
            class="size-20 rounded-full object-cover border border-line"
            @error="avatarFailed = true"
          />
          <div
            v-else
            class="size-20 rounded-full flex items-center justify-center shrink-0 shadow-1"
            :style="{ backgroundImage: avatarColor }"
            :aria-label="displayName || t('settings.heading.photo')"
          >
            <span class="font-semibold text-[28px] text-white leading-none">
              {{ avatarInitials }}
            </span>
          </div>
        </div>

        <div class="min-w-0 flex-1 pt-0.5">
          <h2 class="text-[14px] font-semibold text-ink">
            {{ t('settings.heading.photo') }}
          </h2>
          <p class="text-[13px] text-ink-3 mt-1 leading-relaxed">
            {{ t('onboard.info.profile_photo_help') }}
          </p>
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            :disabled="!editing"
            @change="onPickAvatar"
          />
          <BaseButton
            v-if="editing"
            intent="secondary"
            size="sm"
            class="mt-3"
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
    </section>

    <section class="bg-card border border-line rounded-md shadow-1 px-6 py-5">
      <h2 class="text-[14px] font-semibold text-ink">
        {{ t('settings.heading.about_you') }}
      </h2>
      <p class="text-[12.5px] text-ink-4 mt-0.5 mb-5">
        {{ t('settings.info.about_help') }}
      </p>

      <div class="flex flex-col gap-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            id="settings-firstName"
            v-model="firstName"
            :label="t('onboard.label.first_name')"
            :placeholder="t('onboard.label.first_name_placeholder')"
            :intent="editing && errors?.firstName ? 'error' : 'primary'"
            :error-msg="editing ? errors?.firstName : undefined"
            :reserve-error="editing"
            :readonly="!editing"
            autocomplete="given-name"
            @input="onFirstNameInput"
          />
          <BaseInput
            id="settings-lastName"
            v-model="lastName"
            :label="t('onboard.label.last_name')"
            :placeholder="t('onboard.label.last_name_placeholder')"
            :intent="editing && errors?.lastName ? 'error' : 'primary'"
            :error-msg="editing ? errors?.lastName : undefined"
            :reserve-error="editing"
            :readonly="!editing"
            autocomplete="family-name"
            @input="onLastNameInput"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <BaseInput
            v-if="editing"
            id="settings-dateOfBirth"
            v-model="dateOfBirth"
            type="date"
            :label="t('onboard.label.date_of_birth')"
            :intent="errors?.dateOfBirth ? 'error' : 'primary'"
            :error-msg="errors?.dateOfBirth"
            :min="dobMin"
            :max="dobMax"
            autocomplete="bday"
            @input="onDateOfBirthInput"
            @blur="onDateOfBirthBlur"
          />
          <div
            v-else
            class="min-w-0 flex flex-col"
          >
            <p class="block text-sm font-semibold text-ink-2 mb-1">
              {{ t('onboard.label.date_of_birth') }}
            </p>
            <p class="text-[14.5px] text-ink font-medium py-2.5">
              {{ dateOfBirthLabel }}
            </p>
          </div>
          <LocationAutocomplete
            v-if="editing"
            id="settings-location"
            v-model="location"
            v-model:display-name="locationName"
            :label="t('onboard.label.location')"
            :placeholder="t('onboard.label.location_placeholder')"
            :intent="errors?.location ? 'error' : 'primary'"
            :error-msg="errors?.location"
            @change="clearError('location')"
            @search-error="onLocationSearchError"
          />
          <div
            v-else
            class="min-w-0 flex flex-col"
          >
            <p class="block text-sm font-semibold text-ink-2 mb-1">
              {{ t('onboard.label.location') }}
            </p>
            <p class="text-[14.5px] text-ink font-medium py-2.5">
              {{ locationLabel }}
            </p>
          </div>
        </div>

        <div v-if="editing">
          <OccupationAutocomplete
            id="settings-occupation"
            v-model="occupation"
            v-model:display-name="occupationName"
            :label="t('onboard.label.occupation')"
            :placeholder="t('onboard.label.occupation_placeholder')"
            :intent="errors?.occupation ? 'error' : 'primary'"
            :error-msg="errors?.occupation"
            @change="clearError('occupation')"
            @search-error="onOccupationSearchError"
          />
        </div>
        <div
          v-else
          class="min-w-0"
        >
          <p class="block text-sm font-semibold text-ink-2 mb-1">
            {{ t('onboard.label.occupation') }}
          </p>
          <p class="text-[14.5px] text-ink font-medium">
            {{ occupationLabel }}
          </p>
        </div>
      </div>
    </section>

    <section class="bg-card border border-line rounded-md shadow-1 px-6 py-5">
      <h2 class="text-[14px] font-semibold text-ink">
        {{ t('settings.heading.profile_url') }}
      </h2>
      <p class="text-[12.5px] text-ink-4 mt-0.5 mb-5">
        {{ t('settings.info.profile_url_help') }}
      </p>

      <div
        v-if="!editing"
        class="text-[14.5px] text-ink font-medium"
      >
        {{ profilePath || '—' }}
      </div>
      <BaseInput
        v-else
        id="settings-url-key"
        v-model="urlKey"
        :label="t('profiles.label.profile_url')"
        :placeholder="t('profiles.label.profile_url_placeholder')"
        :intent="errors?.urlKey ? 'error' : 'primary'"
        :error-msg="errors?.urlKey"
        reserve-error
        @input="clearError('urlKey')"
      />
    </section>

    <div
      v-if="editing"
      class="flex justify-end gap-2"
    >
      <BaseButton
        intent="secondary"
        :disabled="saving || uploading"
        @click="cancelEditing"
      >
        {{ t('settings.action.cancel') }}
      </BaseButton>
      <BaseButton
        intent="primary"
        :disabled="saving || uploading"
        @click="onSave"
      >
        {{
          saving
            ? t('settings.action.saving')
            : t('settings.action.save')
        }}
      </BaseButton>
    </div>
  </div>
</template>
