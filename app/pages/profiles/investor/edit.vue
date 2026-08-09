<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import { useAccount } from '~/composables/accounts/useAccount'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import type { InvestorProfilePayload } from '~/types/profile'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const toast = useToast()
const localePath = useLocalePath()
const { createInvestor, updateInvestor, getInvestor } = useProfilesApi()
const { refreshAccounts } = useAccount()

const existingId = ref<string | null>(null)
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  firmName: '',
  description: '',
  industry: '',
  contactEmail: '',
  websiteUrl: '',
  minInvestmentUsd: '',
  maxInvestmentUsd: '',
})

onMounted(async () => {
  try {
    const { listAccounts } = useProfilesApi()
    const accounts = await listAccounts()
    const investor = accounts.find(a => a.accountType === 'investor')
    if (investor) {
      existingId.value = investor.id
      const full = await getInvestor(investor.id)
      form.firmName = full.firmName
      form.description = full.description ?? ''
      form.industry = full.industry
      form.contactEmail = full.contactEmail
      form.websiteUrl = full.websiteUrl ?? ''
      form.minInvestmentUsd
        = full.minInvestmentUsd != null ? String(full.minInvestmentUsd) : ''
      form.maxInvestmentUsd
        = full.maxInvestmentUsd != null ? String(full.maxInvestmentUsd) : ''
    }
  }
  catch {
    // New investor form
  }
  finally {
    loading.value = false
  }
})

function toPayload(): InvestorProfilePayload {
  return {
    firmName: form.firmName.trim(),
    description: form.description.trim() || undefined,
    industry: form.industry.trim(),
    contactEmail: form.contactEmail.trim(),
    websiteUrl: form.websiteUrl.trim() || undefined,
    minInvestmentUsd: form.minInvestmentUsd
      ? Number(form.minInvestmentUsd)
      : undefined,
    maxInvestmentUsd: form.maxInvestmentUsd
      ? Number(form.maxInvestmentUsd)
      : undefined,
  }
}

async function onSave() {
  saving.value = true
  try {
    const payload = toPayload()
    const saved = existingId.value
      ? await updateInvestor(payload)
      : await createInvestor(payload)
    existingId.value = saved.id
    await refreshAccounts()
    toast.showSuccess(t('profiles.info.investor_saved'), 2000)
    await navigateTo(localePath(`/investor/${saved.id}`))
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
          ? t('profiles.heading.investor_edit')
          : t('profiles.heading.investor_create')
      }}
    </h1>
    <p class="text-sm text-ink-3 mb-6">
      {{ t('profiles.info.investor_edit') }}
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
        id="investor-firm"
        v-model="form.firmName"
        :label="t('profiles.label.firm_name')"
        :placeholder="t('profiles.label.firm_name_placeholder')"
      />
      <div>
        <label
          class="block text-sm font-semibold text-ink-2 mb-1"
          for="investor-description"
        >{{ t('profiles.label.description') }}</label>
        <textarea
          id="investor-description"
          v-model="form.description"
          rows="4"
          class="bg-card border border-line rounded-md py-2.5 px-3 text-ink text-sm w-full outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 placeholder:text-ink-4"
          :placeholder="t('profiles.label.description_placeholder')"
        />
      </div>
      <div class="grid grid-cols-2 gap-[18px]">
        <BaseInput
          id="investor-industry"
          v-model="form.industry"
          :label="t('profiles.label.industry')"
          :placeholder="t('profiles.label.industry_placeholder')"
        />
        <BaseInput
          id="investor-email"
          v-model="form.contactEmail"
          :label="t('profiles.label.contact_email')"
          :placeholder="t('profiles.label.contact_email_placeholder')"
        />
      </div>
      <BaseInput
        id="investor-website"
        v-model="form.websiteUrl"
        :label="t('profiles.label.website')"
        :placeholder="t('profiles.label.website_placeholder')"
      />
      <div class="grid grid-cols-2 gap-[18px]">
        <BaseInput
          id="investor-min"
          v-model="form.minInvestmentUsd"
          :label="t('profiles.label.min_investment')"
          placeholder="25000"
          inputmode="numeric"
        />
        <BaseInput
          id="investor-max"
          v-model="form.maxInvestmentUsd"
          :label="t('profiles.label.max_investment')"
          placeholder="250000"
          inputmode="numeric"
        />
      </div>
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
