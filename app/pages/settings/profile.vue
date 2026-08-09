<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
import SettingsBackLink from '~/components/settings/SettingsBackLink.vue'
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

const editing = ref(false)
const firstName = ref('')
const lastName = ref('')
const age = ref('')
const location = ref('')
const occupation = ref('')
const urlKey = ref('')
const profilePath = ref<string | null>(null)
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
  urlKey.value = p.urlKey ?? ''
  profilePath.value = p.profilePath
  avatarUrl.value = p.avatarUrl
  avatarFailed.value = false
}

onMounted(async () => {
  await refreshProfile()
  hydrate()
})

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

function onAgeInput(event: Event) {
  if (!editing.value) return
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
      age: data.age,
      location: data.location,
      occupation: data.occupation,
      urlKey: urlKey.value.trim(),
    })
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
            class="size-20 rounded-full border-2 border-dashed border-line-2 bg-surface-hover flex items-center justify-center text-ink-4"
          >
            <BaseIcon
              name="camera"
              size="1.75em"
            />
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

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BaseInput
            id="settings-age"
            v-model="age"
            :label="t('onboard.label.age')"
            :placeholder="t('onboard.label.age_placeholder')"
            :intent="editing && errors?.age ? 'error' : 'primary'"
            :error-msg="editing ? errors?.age : undefined"
            :reserve-error="editing"
            :readonly="!editing"
            inputmode="numeric"
            @input="onAgeInput"
          />
          <BaseInput
            id="settings-location"
            v-model="location"
            :label="t('onboard.label.location')"
            :placeholder="t('onboard.label.location_placeholder')"
            :intent="editing && errors?.location ? 'error' : 'primary'"
            :error-msg="editing ? errors?.location : undefined"
            :reserve-error="editing"
            :readonly="!editing"
            @input="clearError('location')"
          />
        </div>

        <BaseInput
          id="settings-occupation"
          v-model="occupation"
          :label="t('onboard.label.occupation')"
          :placeholder="t('onboard.label.occupation_placeholder')"
          :intent="editing && errors?.occupation ? 'error' : 'primary'"
          :error-msg="editing ? errors?.occupation : undefined"
          :reserve-error="editing"
          :readonly="!editing"
          @input="clearError('occupation')"
        />
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
