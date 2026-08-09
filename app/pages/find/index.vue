<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import ResultCard from '~/components/directory/ResultCard.vue'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import type { FindResults } from '~/types/profile'
import { stageToPillVariant } from '~/utils/stagePill'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const { find } = useProfilesApi()

type FindType = 'all' | 'user' | 'startup' | 'investor'

const q = ref('')
const type = ref<FindType>('all')
const industry = ref('')
const location = ref('')
const loading = ref(false)
const searched = ref(false)
const results = ref<FindResults>({
  users: [],
  startups: [],
  investors: [],
})

const typeFilters: { value: FindType, labelKey: string }[] = [
  { value: 'all', labelKey: 'find.type.all' },
  { value: 'user', labelKey: 'find.type.user' },
  { value: 'startup', labelKey: 'find.type.startup' },
  { value: 'investor', labelKey: 'find.type.investor' },
]

async function onSearch() {
  loading.value = true
  try {
    results.value = await find({
      q: q.value.trim() || undefined,
      type: type.value === 'all' ? undefined : type.value,
      industry: industry.value.trim() || undefined,
      location: location.value.trim() || undefined,
    })
    searched.value = true
  }
  catch {
    results.value = { users: [], startups: [], investors: [] }
    searched.value = true
  }
  finally {
    loading.value = false
  }
}

function selectType(next: FindType) {
  type.value = next
  if (searched.value) void onSearch()
}

function clearFilters() {
  q.value = ''
  type.value = 'all'
  industry.value = ''
  location.value = ''
  results.value = { users: [], startups: [], investors: [] }
  searched.value = false
}

const totalCount = computed(
  () =>
    results.value.users.length
    + results.value.startups.length
    + results.value.investors.length,
)

const flatResults = computed(() => {
  const rows: {
    key: string
    name: string
    href: string
    targetType: 'user' | 'startup' | 'investor'
    targetId: string
    industry: string | null
    description: string | null
    meta: string[]
    pillVariant: ReturnType<typeof stageToPillVariant>
    pillLabel?: string
    avatarUrl: string | null
  }[] = []

  for (const user of results.value.users) {
    rows.push({
      key: `user-${user.id}`,
      name: user.name || t('profiles.info.unnamed'),
      href: `/u/${user.id}`,
      targetType: 'user',
      targetId: user.id,
      industry: user.occupation,
      description: null,
      meta: [user.role, user.location].filter(Boolean) as string[],
      pillVariant: user.role === 'Investor' ? 'investor' : undefined,
      pillLabel: user.role ?? undefined,
      avatarUrl: user.avatarUrl,
    })
  }

  for (const startup of results.value.startups) {
    rows.push({
      key: `startup-${startup.id}`,
      name: startup.companyName,
      href: `/startup/${startup.id}`,
      targetType: 'startup',
      targetId: startup.id,
      industry: startup.industry,
      description: startup.description,
      meta: [
        t('profiles.info.stats', {
          views: startup.views,
          connections: startup.connections,
        }),
      ],
      pillVariant: stageToPillVariant(startup.stage),
      pillLabel: t(`profiles.stage.${startup.stage}`),
      avatarUrl: startup.avatarUrl || startup.logoUrl,
    })
  }

  for (const investor of results.value.investors) {
    rows.push({
      key: `investor-${investor.id}`,
      name: investor.firmName,
      href: `/investor/${investor.id}`,
      targetType: 'investor',
      targetId: investor.id,
      industry: investor.industry,
      description: investor.description,
      meta: [
        t('profiles.info.stats', {
          views: investor.views,
          connections: investor.connections,
        }),
      ],
      pillVariant: 'investor',
      pillLabel: t('find.type.investor'),
      avatarUrl: investor.avatarUrl || investor.logoUrl,
    })
  }

  return rows
})
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="bg-card border border-line rounded-md shadow-1 overflow-hidden">
      <div
        class="px-5 pt-4 pb-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 class="text-[15px] font-semibold text-ink">
            {{ t('find.heading.directory') }}
          </h1>
          <p class="text-[12.5px] text-ink-4 mt-0.5">
            <template v-if="searched">
              <b class="text-ink font-semibold">{{
                t('find.info.results', { count: totalCount })
              }}</b>
              — {{ t('find.info.matching') }}
            </template>
            <template v-else>
              {{ t('find.info.subtitle') }}
            </template>
          </p>
        </div>
      </div>
      <hr class="border-0 h-px bg-line">
      <div class="px-5 py-3.5 flex flex-col gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <div class="w-full sm:w-[220px]">
            <BaseInput
              id="find-q"
              v-model="q"
              :placeholder="t('find.label.query_placeholder')"
              @keyup.enter="onSearch"
            />
          </div>
          <span
            class="hidden sm:block w-px h-6 bg-line mx-1"
            aria-hidden="true"
          />
          <button
            v-for="filter in typeFilters"
            :key="filter.value"
            type="button"
            class="inline-flex items-center gap-1.5 border-[1.4px] rounded-pill px-3.5 py-[7px] text-[12.5px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
            :class="
              type === filter.value
                ? 'bg-brand-tint border-brand text-brand'
                : 'bg-card border-line text-ink-2 hover:border-line-2 hover:bg-surface-hover'
            "
            @click="selectType(filter.value)"
          >
            {{ t(filter.labelKey) }}
          </button>
          <button
            v-if="searched || q || industry || location || type !== 'all'"
            type="button"
            class="ml-auto text-[12.5px] font-semibold text-brand cursor-pointer bg-transparent border-0"
            @click="clearFilters"
          >
            {{ t('find.action.clear_all') }}
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BaseInput
            id="find-industry"
            v-model="industry"
            :placeholder="t('profiles.label.industry_placeholder')"
            @keyup.enter="onSearch"
          />
          <BaseInput
            id="find-location"
            v-model="location"
            :placeholder="t('onboard.label.location_placeholder')"
            @keyup.enter="onSearch"
          />
        </div>
        <div class="flex justify-end">
          <BaseButton
            intent="primary"
            size="sm"
            :disabled="loading"
            @click="onSearch"
          >
            {{
              loading
                ? t('find.action.searching')
                : t('find.action.search')
            }}
          </BaseButton>
        </div>
      </div>
    </div>

    <div
      v-if="searched && flatResults.length === 0"
      class="bg-card border border-line rounded-md shadow-1 px-5 py-8 text-center text-sm text-ink-3"
    >
      {{ t('find.info.empty') }}
    </div>

    <ResultCard
      v-for="row in flatResults"
      :key="row.key"
      :name="row.name"
      :href="row.href"
      :target-type="row.targetType"
      :target-id="row.targetId"
      :industry="row.industry"
      :description="row.description"
      :meta="row.meta"
      :pill-variant="row.pillVariant"
      :pill-label="row.pillLabel"
      :avatar-url="row.avatarUrl"
    />
  </div>
</template>
