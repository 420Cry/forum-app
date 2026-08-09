<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import BaseIcon from '~/components/shared/BaseIcon.vue'
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
const industryDraft = ref('')
const industries = ref<string[]>([])

const form = reactive({
  companyName: '',
  description: '',
  stage: 'pre_seed' as (typeof startupStages)[number],
  websiteUrl: '',
  contactEmail: '',
  foundedAt: '',
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
    const startup = accounts.find(a => a.accountType === 'startup')
    if (startup) {
      existingId.value = startup.id
      const full = await getStartup(startup.id)
      form.companyName = full.companyName
      form.description = full.description ?? ''
      form.stage = full.stage as (typeof startupStages)[number]
      industries.value = parseIndustries(full.industry)
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
    industry: syncIndustryFromList() || industryDraft.value.trim(),
    websiteUrl: form.websiteUrl.trim() || undefined,
    contactEmail: form.contactEmail.trim(),
    foundedAt: form.foundedAt,
  }
}

async function onSave() {
  if (industryDraft.value.trim()) addIndustry()
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
  <div class="max-w-[760px] mx-auto flex flex-col gap-4">
    <div>
      <h1 class="text-[22px] font-bold text-ink tracking-[-0.02em]">
        {{
          existingId
            ? t('profiles.heading.startup_edit')
            : t('profiles.heading.startup_create')
        }}
      </h1>
      <p class="text-[14px] text-ink-3 mt-1.5 max-w-[52ch]">
        {{ t('profiles.info.startup_edit') }}
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
            {{ t('profiles.section.identity') }}
          </h2>
          <p class="text-[12.5px] text-ink-3 mt-1">
            {{ t('profiles.section.identity_help') }}
          </p>
        </div>

        <BaseInput
          id="startup-company"
          v-model="form.companyName"
          :label="t('profiles.label.company_name')"
          :placeholder="t('profiles.label.company_name_placeholder')"
        />

        <div>
          <p class="text-sm font-semibold text-ink-2 mb-2">
            {{ t('profiles.label.stage') }}
          </p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="stage in startupStages"
              :key="stage"
              type="button"
              class="inline-flex items-center rounded-pill px-3 py-1.5 text-[12.5px] font-semibold border transition-colors cursor-pointer"
              :class="
                form.stage === stage
                  ? 'bg-brand-tint border-brand text-brand'
                  : 'bg-card border-line text-ink-2 hover:bg-surface-hover'
              "
              @click="form.stage = stage"
            >
              {{ t(`profiles.stage.${stage}`) }}
            </button>
          </div>
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
              id="startup-industry-draft"
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
      </section>

      <section
        class="bg-card border border-line rounded-md shadow-1 px-7 py-6 flex flex-col gap-4"
      >
        <div>
          <h2 class="text-[15px] font-semibold text-ink">
            {{ t('profiles.section.pitch') }}
          </h2>
          <p class="text-[12.5px] text-ink-3 mt-1">
            {{ t('profiles.section.pitch_help') }}
          </p>
        </div>
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
