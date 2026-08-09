<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import { useAccount } from '~/composables/accounts/useAccount'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import { startupStages, type StartupProfilePayload } from '~/types/profile'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const toast = useToast()
const localePath = useLocalePath()
const { createStartup, updateStartup, getStartup } = useProfilesApi()
const { refreshAccounts } = useAccount()

const existingId = ref<string | null>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  companyName: '',
  description: '',
  stage: 'pre_seed' as (typeof startupStages)[number],
  industry: '',
  websiteUrl: '',
  contactEmail: '',
  foundedAt: '',
})

onMounted(async () => {
  try {
    const { listAccounts } = useProfilesApi()
    const accounts = await listAccounts()
    const startup = accounts.find(a => a.accountType === 'startup')
    if (startup) {
      existingId.value = startup.id
      const full = await getStartup(startup.id)
      form.companyName = full.companyName
      form.description = full.description ?? ''
      form.stage = full.stage as (typeof startupStages)[number]
      form.industry = full.industry
      form.websiteUrl = full.websiteUrl ?? ''
      form.contactEmail = full.contactEmail
      form.foundedAt = full.foundedAt
    }
  }
  catch {
    // New startup form
  }
  finally {
    loading.value = false
  }
})

function toPayload(): StartupProfilePayload {
  return {
    companyName: form.companyName.trim(),
    description: form.description.trim() || undefined,
    stage: form.stage,
    industry: form.industry.trim(),
    websiteUrl: form.websiteUrl.trim() || undefined,
    contactEmail: form.contactEmail.trim(),
    foundedAt: form.foundedAt,
  }
}

async function onSave() {
  saving.value = true
  try {
    const payload = toPayload()
    const saved = existingId.value
      ? await updateStartup(payload)
      : await createStartup(payload)
    existingId.value = saved.id
    await refreshAccounts()
    toast.showSuccess(t('profiles.info.startup_saved'), 2000)
    await navigateTo(localePath(`/startup/${saved.id}`))
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
      {{
        existingId
          ? t('profiles.heading.startup_edit')
          : t('profiles.heading.startup_create')
      }}
    </h1>
    <p class="text-sm text-ink-3 mb-6">
      {{ t('profiles.info.startup_edit') }}
    </p>

    <p
      v-if="loading"
      class="text-sm text-ink-3"
    >
      {{ t('common.info.loading') }}
    </p>

    <div
      v-else
      class="max-w-[760px] bg-card border border-line rounded-md shadow-1 px-8 py-7 flex flex-col gap-5"
    >
      <BaseInput
        id="startup-company"
        v-model="form.companyName"
        :label="t('profiles.label.company_name')"
        :placeholder="t('profiles.label.company_name_placeholder')"
      />
      <div>
        <label
          class="block text-sm font-semibold text-ink-2 mb-1"
          for="startup-description"
        >{{ t('profiles.label.description') }}</label>
        <textarea
          id="startup-description"
          v-model="form.description"
          rows="4"
          class="bg-card border border-line rounded-md py-2.5 px-3 text-ink text-sm w-full outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 placeholder:text-ink-4"
          :placeholder="t('profiles.label.description_placeholder')"
        />
      </div>
      <div class="grid grid-cols-2 gap-[18px]">
        <div>
          <label
            class="block text-sm font-semibold text-ink-2 mb-1"
            for="startup-stage"
          >{{ t('profiles.label.stage') }}</label>
          <select
            id="startup-stage"
            v-model="form.stage"
            class="bg-card border border-line rounded-md py-2.5 px-3 text-ink text-sm w-full outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option
              v-for="stage in startupStages"
              :key="stage"
              :value="stage"
            >
              {{ t(`profiles.stage.${stage}`) }}
            </option>
          </select>
        </div>
        <BaseInput
          id="startup-industry"
          v-model="form.industry"
          :label="t('profiles.label.industry')"
          :placeholder="t('profiles.label.industry_placeholder')"
        />
      </div>
      <div class="grid grid-cols-2 gap-[18px]">
        <BaseInput
          id="startup-website"
          v-model="form.websiteUrl"
          :label="t('profiles.label.website')"
          :placeholder="t('profiles.label.website_placeholder')"
        />
        <BaseInput
          id="startup-email"
          v-model="form.contactEmail"
          :label="t('profiles.label.contact_email')"
          :placeholder="t('profiles.label.contact_email_placeholder')"
        />
      </div>
      <BaseInput
        id="startup-founded"
        v-model="form.foundedAt"
        :label="t('profiles.label.founded_at')"
        placeholder="2024-01-15"
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
</template>
