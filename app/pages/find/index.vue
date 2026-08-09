<script setup lang="ts">
import BaseButton from '~/components/shared/BaseButton.vue'
import BaseInput from '~/components/shared/BaseInput.vue'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import type { FindResults } from '~/types/profile'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const localePath = useLocalePath()
const { find } = useProfilesApi()

const q = ref('')
const type = ref<'all' | 'user' | 'startup' | 'investor'>('all')
const industry = ref('')
const location = ref('')
const loading = ref(false)
const searched = ref(false)
const results = ref<FindResults>({
  users: [],
  startups: [],
  investors: [],
})

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

const totalCount = computed(
  () =>
    results.value.users.length
    + results.value.startups.length
    + results.value.investors.length,
)
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-7 py-6">
    <h1 class="text-xl font-semibold text-ink mb-1">
      {{ t('find.heading.title') }}
    </h1>
    <p class="text-sm text-ink-3 mb-6">
      {{ t('find.info.subtitle') }}
    </p>

    <div
      class="bg-card border border-line rounded-md shadow-1 px-6 py-5 flex flex-col gap-4 mb-6"
    >
      <BaseInput
        id="find-q"
        v-model="q"
        :label="t('find.label.query')"
        :placeholder="t('find.label.query_placeholder')"
      />
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            class="block text-sm font-semibold text-ink-2 mb-1"
            for="find-type"
          >{{ t('find.label.type') }}</label>
          <select
            id="find-type"
            v-model="type"
            class="bg-card border border-line rounded-md py-2.5 px-3 text-ink text-sm w-full outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          >
            <option value="all">
              {{ t('find.type.all') }}
            </option>
            <option value="user">
              {{ t('find.type.user') }}
            </option>
            <option value="startup">
              {{ t('find.type.startup') }}
            </option>
            <option value="investor">
              {{ t('find.type.investor') }}
            </option>
          </select>
        </div>
        <BaseInput
          id="find-industry"
          v-model="industry"
          :label="t('profiles.label.industry')"
          :placeholder="t('profiles.label.industry_placeholder')"
        />
        <BaseInput
          id="find-location"
          v-model="location"
          :label="t('onboard.label.location')"
          :placeholder="t('onboard.label.location_placeholder')"
        />
      </div>
      <div class="flex justify-end">
        <BaseButton
          intent="primary"
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

    <p
      v-if="searched"
      class="text-sm text-ink-3 mb-4"
    >
      {{ t('find.info.results', { count: totalCount }) }}
    </p>

    <div
      v-if="results.users.length"
      class="mb-6"
    >
      <h2 class="text-sm font-semibold text-ink-2 mb-2">
        {{ t('find.type.user') }}
      </h2>
      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="user in results.users"
          :key="user.id"
          :to="localePath(`/u/${user.id}`)"
          class="block bg-card border border-line rounded-md px-4 py-3 hover:bg-surface-hover no-underline"
        >
          <p class="font-semibold text-[14px] text-ink">
            {{ user.name || t('profiles.info.unnamed') }}
          </p>
          <p class="text-sm text-ink-3 mt-0.5">
            {{
              [user.role, user.occupation, user.location]
                .filter(Boolean)
                .join(' · ')
            }}
          </p>
        </NuxtLink>
      </div>
    </div>

    <div
      v-if="results.startups.length"
      class="mb-6"
    >
      <h2 class="text-sm font-semibold text-ink-2 mb-2">
        {{ t('find.type.startup') }}
      </h2>
      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="startup in results.startups"
          :key="startup.id"
          :to="localePath(`/startup/${startup.id}`)"
          class="block bg-card border border-line rounded-md px-4 py-3 hover:bg-surface-hover no-underline"
        >
          <p class="font-semibold text-[14px] text-ink">
            {{ startup.companyName }}
          </p>
          <p class="text-sm text-ink-3 mt-0.5">
            {{ startup.industry }} · {{ t(`profiles.stage.${startup.stage}`) }}
          </p>
        </NuxtLink>
      </div>
    </div>

    <div
      v-if="results.investors.length"
      class="mb-6"
    >
      <h2 class="text-sm font-semibold text-ink-2 mb-2">
        {{ t('find.type.investor') }}
      </h2>
      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="investor in results.investors"
          :key="investor.id"
          :to="localePath(`/investor/${investor.id}`)"
          class="block bg-card border border-line rounded-md px-4 py-3 hover:bg-surface-hover no-underline"
        >
          <p class="font-semibold text-[14px] text-ink">
            {{ investor.firmName }}
          </p>
          <p class="text-sm text-ink-3 mt-0.5">
            {{ investor.industry }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
