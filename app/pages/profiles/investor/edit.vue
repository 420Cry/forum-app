<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
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
const industryDraft = ref('')
const industries = ref<string[]>([])

const form = reactive({
  firmName: '',
  description: '',
  contactEmail: '',
  websiteUrl: '',
  minInvestmentUsd: '',
  maxInvestmentUsd: '',
})

function syncIndustryFromList() {
  return industries.value.join(', ')
}

function parseIndustries(raw: string) {
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

function addIndustry() {
  const next = industryDraft.value.trim()
  if (!next) return
  if (!industries.value.some(i => i.toLowerCase() === next.toLowerCase())) {
    industries.value = [...industries.value, next]
  }
  industryDraft.value = ''
}

function removeIndustry(tag: string) {
  industries.value = industries.value.filter(i => i !== tag)
}

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
      industries.value = parseIndustries(full.industry)
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
    industry: syncIndustryFromList() || industryDraft.value.trim(),
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
  if (industryDraft.value.trim()) addIndustry()
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
  <div class="max-w-[760px] mx-auto flex flex-col gap-4">
    <div>
      <h1 class="text-[22px] font-bold text-ink tracking-[-0.02em]">
        {{
          existingId
            ? t('profiles.heading.investor_edit')
            : t('profiles.heading.investor_create')
        }}
      </h1>
      <p class="text-[14px] text-ink-3 mt-1.5 max-w-[52ch]">
        {{ t('profiles.info.investor_edit') }}
      </p>
    </div>

    <p
      v-if="loading"
      class="text-sm text-ink-3"
    >
      {{ t('common.info.loading') }}
    </p>

    <template v-else>
      <section
        class="bg-card border border-line rounded-md shadow-1 px-7 py-6 flex flex-col gap-4"
      >
        <div>
          <h2 class="text-[15px] font-semibold text-ink">
            {{ t('profiles.section.firm') }}
          </h2>
          <p class="text-[12.5px] text-ink-3 mt-1">
            {{ t('profiles.section.firm_help') }}
          </p>
        </div>

        <BaseInput
          id="investor-firm"
          v-model="form.firmName"
          :label="t('profiles.label.firm_name')"
          :placeholder="t('profiles.label.firm_name_placeholder')"
        />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
          <BaseInput
            id="investor-email"
            v-model="form.contactEmail"
            :label="t('profiles.label.contact_email')"
            :placeholder="t('profiles.label.contact_email_placeholder')"
          />
          <BaseInput
            id="investor-website"
            v-model="form.websiteUrl"
            :label="t('profiles.label.website')"
            :placeholder="t('profiles.label.website_placeholder')"
          />
        </div>
      </section>

      <section
        class="bg-card border border-line rounded-md shadow-1 px-7 py-6 flex flex-col gap-4"
      >
        <div>
          <h2 class="text-[15px] font-semibold text-ink">
            {{ t('profiles.section.thesis') }}
          </h2>
          <p class="text-[12.5px] text-ink-3 mt-1">
            {{ t('profiles.section.thesis_help') }}
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-ink-2 mb-2">
            {{ t('profiles.label.industry') }}
          </p>
          <div class="flex flex-wrap gap-2 mb-2">
            <span
              v-for="tag in industries"
              :key="tag"
              class="inline-flex items-center gap-1.5 rounded-pill bg-brand-tint text-brand text-[12.5px] font-semibold pl-3 pr-1.5 py-1"
            >
              {{ tag }}
              <button
                type="button"
                class="size-5 rounded-full flex items-center justify-center hover:bg-brand/10 cursor-pointer border-0 bg-transparent text-brand"
                :aria-label="t('profiles.action.remove_industry')"
                @click="removeIndustry(tag)"
              >
                <BaseIcon
                  name="close"
                  size="0.9em"
                />
              </button>
            </span>
          </div>
          <div class="flex gap-2">
            <BaseInput
              id="investor-industry-draft"
              v-model="industryDraft"
              :placeholder="t('profiles.label.industry_placeholder')"
              class="flex-1"
              @keyup.enter.prevent="addIndustry"
            />
            <BaseButton
              intent="secondary"
              size="sm"
              class="self-end mb-0.5"
              @click="addIndustry"
            >
              {{ t('profiles.action.add_industry') }}
            </BaseButton>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
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
      </section>

      <div class="flex justify-end pt-1">
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
    </template>
  </div>
</template>
