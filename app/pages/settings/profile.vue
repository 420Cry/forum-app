<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import { useOnboardApi } from '~/composables/api/onboard/useOnboardApi'
import { useAvatarUpload } from '~/composables/media/useAvatarUpload'
import { useUserProfile } from '~/composables/user/useUserProfile'
import { createOnboardInfoSchema } from '~/types/onboard/schema/onboardInfoSchema'
import { sanitizeAgeInput, sanitizePersonName } from '~/utils/onboardInput'
import { useZodValidation } from '~/composables/validate/useZodValidation'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const toast = useToast()
const { profile, refreshProfile } = useUserProfile()
const { updateProfile } = useOnboardApi()
const { uploadAvatar } = useAvatarUpload()
const { formInputValidate } = useZodValidation()

const firstName = ref('')
const lastName = ref('')
const age = ref('')
const location = ref('')
const occupation = ref('')
const avatarUrl = ref<string | null>(null)
const avatarFailed = ref(false)
const errors = ref<Record<string, string> | null>(null)
const saving = ref(false)
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function hydrate() {
  const p = profile.value?.profile
  if (!p) return
  const parts = (p.name ?? '').trim().split(/\s+/)
  firstName.value = parts[0] ?? ''
  lastName.value = parts.slice(1).join(' ')
  age.value = p.age != null ? String(p.age) : ''
  location.value = p.location ?? ''
  occupation.value = p.occupation ?? ''
  avatarUrl.value = p.avatarUrl
  avatarFailed.value = false
}

onMounted(async () => {
  await refreshProfile()
  hydrate()
})

function onFirstNameInput(event: Event) {
  const el = event.target as HTMLInputElement
  const next = sanitizePersonName(el.value)
  if (next !== el.value) el.value = next
  firstName.value = next
  clearError('firstName')
}

function onLastNameInput(event: Event) {
  const el = event.target as HTMLInputElement
  const next = sanitizePersonName(el.value)
  if (next !== el.value) el.value = next
  lastName.value = next
  clearError('lastName')
}

function onAgeInput(event: Event) {
  const el = event.target as HTMLInputElement
  const next = sanitizeAgeInput(el.value)
  if (next !== el.value) el.value = next
  age.value = next
  clearError('age')
}

function clearError(field: string) {
  if (!errors.value) return
  const { [field]: _, ...rest } = errors.value
  errors.value = Object.keys(rest).length > 0 ? rest : null
}

async function onPickAvatar(event: Event) {
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
  const { data, errors: nextErrors } = formInputValidate(
    {
      firstName: firstName.value,
      lastName: lastName.value,
      age: age.value,
      location: location.value,
      occupation: occupation.value,
    },
    createOnboardInfoSchema(t),
  )
  if (nextErrors) {
    errors.value = nextErrors
    return
  }
  errors.value = null
  saving.value = true
  try {
    await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
      location: data.location,
      occupation: data.occupation,
    })
    await refreshProfile(true)
    toast.showSuccess(t('settings.info.profile_saved'), 2000)
  }
  catch {
    toast.showError(t('common.error.try_again'), 3000)
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-7 py-6">
    <h1 class="text-xl font-semibold text-ink mb-1">
      {{ t('settings.heading.edit_profile') }}
    </h1>
    <p class="text-sm text-ink-3 mb-6">
      {{ t('settings.info.edit_profile') }}
    </p>

    <div
      class="mx-auto w-full max-w-[760px] bg-card border border-line rounded-md shadow-1 px-8 py-7"
    >
      <div class="flex items-center gap-[22px] mb-[26px]">
        <img
          v-if="avatarUrl && !avatarFailed"
          :src="avatarUrl"
          class="size-24 rounded-full object-cover border border-line flex-none"
          @error="avatarFailed = true"
        />
        <div
          v-else
          class="size-24 rounded-full border-2 border-dashed border-line-2 bg-surface-hover flex items-center justify-center text-ink-4 flex-none"
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
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            @change="onPickAvatar"
          />
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
        <div class="grid grid-cols-2 gap-[18px]">
          <BaseInput
            id="settings-firstName"
            v-model="firstName"
            :label="t('onboard.label.first_name')"
            :placeholder="t('onboard.label.first_name_placeholder')"
            :intent="errors?.firstName ? 'error' : 'primary'"
            :error-msg="errors?.firstName"
            autocomplete="given-name"
            @input="onFirstNameInput"
          />
          <BaseInput
            id="settings-lastName"
            v-model="lastName"
            :label="t('onboard.label.last_name')"
            :placeholder="t('onboard.label.last_name_placeholder')"
            :intent="errors?.lastName ? 'error' : 'primary'"
            :error-msg="errors?.lastName"
            autocomplete="family-name"
            @input="onLastNameInput"
          />
        </div>

        <div class="grid grid-cols-2 gap-[18px]">
          <BaseInput
            id="settings-age"
            v-model="age"
            :label="t('onboard.label.age')"
            :placeholder="t('onboard.label.age_placeholder')"
            :intent="errors?.age ? 'error' : 'primary'"
            :error-msg="errors?.age"
            inputmode="numeric"
            @input="onAgeInput"
          />
          <BaseInput
            id="settings-location"
            v-model="location"
            :label="t('onboard.label.location')"
            :placeholder="t('onboard.label.location_placeholder')"
            :intent="errors?.location ? 'error' : 'primary'"
            :error-msg="errors?.location"
            @input="clearError('location')"
          />
        </div>

        <BaseInput
          id="settings-occupation"
          v-model="occupation"
          :label="t('onboard.label.occupation')"
          :placeholder="t('onboard.label.occupation_placeholder')"
          :intent="errors?.occupation ? 'error' : 'primary'"
          :error-msg="errors?.occupation"
          @input="clearError('occupation')"
        />

        <div class="flex justify-end pt-2">
          <BaseButton
            intent="primary"
            :disabled="saving"
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
    </div>
  </div>
</template>
