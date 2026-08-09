<script setup lang="ts">
import ProfileHeaderCard from '~/components/profile/ProfileHeaderCard.vue'
import ProfileAboutCard from '~/components/profile/ProfileAboutCard.vue'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import type { PublicUserProfile } from '~/types/profile'

definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { getPublicUser } = useProfilesApi()

const routeKey = computed(() => String(route.params.id ?? ''))
const profile = ref<PublicUserProfile | null>(null)
const error = ref(false)
const loading = ref(true)

onMounted(async () => {
  try {
    const next = await getPublicUser(routeKey.value)
    profile.value = next
    if (next.urlKey !== routeKey.value) {
      await navigateTo(localePath(next.profilePath), { replace: true })
    }
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})

const facts = computed(() => {
  const p = profile.value
  if (!p) return []
  const rows: { key: string, value: string, chips?: string[] }[] = []
  if (p.role) rows.push({ key: t('profiles.fact.role'), value: p.role })
  if (p.occupation) {
    rows.push({ key: t('profiles.fact.occupation'), value: p.occupation })
  }
  if (p.location) {
    rows.push({ key: t('profiles.fact.location'), value: p.location })
  }
  if (p.goals.length) {
    rows.push({
      key: t('profiles.fact.goals'),
      value: p.goals.join(', '),
      chips: p.goals,
    })
  }
  return rows
})
</script>

<template>
  <div class="flex flex-col gap-4">
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
        :name="profile.name || t('profiles.info.unnamed')"
        target-type="user"
        :target-id="profile.id"
        :tagline="profile.occupation"
        :meta="
          [profile.role, profile.location].filter(Boolean) as string[]
        "
        :pill-variant="profile.role === 'Investor' ? 'investor' : undefined"
        :pill-label="profile.role ?? undefined"
        :avatar-url="profile.avatarUrl"
      />
      <ProfileAboutCard
        :about="null"
        :facts="facts"
      />
    </template>
  </div>
</template>
