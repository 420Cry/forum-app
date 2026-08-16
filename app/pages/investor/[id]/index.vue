<script setup lang="ts">
import ProfileHeaderCard from '~/components/profile/ProfileHeaderCard.vue'
import ProfileAboutCard from '~/components/profile/ProfileAboutCard.vue'
import FollowListSheet from '~/components/profile/FollowListSheet.vue'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import { useProfileFollowSheet } from '~/composables/social/useProfileFollowSheet'
import type { InvestorProfile } from '~/types/profile'

definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { getInvestor, recordInvestorView } = useProfilesApi()

const id = computed(() => String(route.params.id ?? ''))
const profile = ref<InvestorProfile | null>(null)
const error = ref(false)
const loading = ref(true)

const { sheetOpen, sheetMode, onStatClick } = useProfileFollowSheet({
  allowedModes: ['followers'],
})
const user = useSupabaseUser()
const { profile: me } = useUserProfile()

onMounted(async () => {
  try {
    profile.value = await getInvestor(id.value)
    if (user.value?.id || me.value?.id) {
      void recordInvestorView(id.value)
        .then((res) => {
          if (profile.value) profile.value = { ...profile.value, views: res.views }
        })
        .catch(() => {})
    }
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})

const avatar = computed(
  () => profile.value?.avatarUrl || profile.value?.logoUrl || null,
)

const headerStats = computed(() => {
  const p = profile.value
  if (!p) return []
  return [
    {
      key: 'followers',
      count: p.followersCount ?? p.connections ?? 0,
      label: t('profiles.stat.followers'),
      interactive: true,
    },
    {
      key: 'views',
      count: p.views ?? 0,
      label: t('profiles.stat.views'),
    },
  ]
})

function formatCheck(min: number | null, max: number | null) {
  if (min == null && max == null) return null
  const fmt = (n: number) =>
    new Intl.NumberFormat('en', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(n)
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`
  if (min != null) return `${fmt(min)}+`
  return `Up to ${fmt(max!)}`
}

const facts = computed(() => {
  const p = profile.value
  if (!p) return []
  const rows: { key: string, value: string }[] = [
    { key: t('profiles.fact.industry'), value: p.industry },
  ]
  const check = formatCheck(p.minInvestmentUsd, p.maxInvestmentUsd)
  if (check) {
    rows.push({ key: t('profiles.fact.check_size'), value: check })
  }
  if (p.websiteUrl) {
    rows.push({ key: t('profiles.fact.website'), value: p.websiteUrl })
  }
  return rows
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <NuxtLink
      :to="localePath('/find')"
      class="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 hover:text-brand no-underline self-start"
    >
      ← {{ t('profiles.action.back_to_find') }}
    </NuxtLink>

    <p
      v-if="loading"
      class="text-sm text-ink-3"
    >
      {{ t('common.info.loading') }}
    </p>
    <p
      v-else-if="error || !profile"
      class="text-sm text-ink-3"
    >
      {{ t('profiles.error.not_found') }}
    </p>
    <template v-else>
      <ProfileHeaderCard
        :name="profile.firmName"
        target-type="investor"
        :target-id="profile.id"
        :owner-user-id="profile.userId"
        :tagline="profile.description"
        :meta="[profile.industry]"
        :stats="headerStats"
        pill-variant="investor"
        :pill-label="t('find.type.investor')"
        :avatar-url="avatar"
        @stat-click="onStatClick"
      />
      <ProfileAboutCard
        :about="profile.description"
        :facts="facts"
      />
      <FollowListSheet
        v-model:open="sheetOpen"
        :title="t('profiles.heading.followers')"
        :mode="sheetMode"
        target-type="investor"
        :target-id="profile.id"
        :empty-message="t('profiles.info.followers_empty')"
        :error-message="t('profiles.info.followers_error')"
      />
    </template>
  </div>
</template>
