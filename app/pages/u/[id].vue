<script setup lang="ts">
import ProfileAboutCard from '~/components/profile/ProfileAboutCard.vue'
import ProfileHeaderCard from '~/components/profile/ProfileHeaderCard.vue'
import { usePublicUserPage } from '~/composables/profile/usePublicUserPage'
import { locationCatalogLabel } from '~/utils/catalogLabel'

definePageMeta({ layout: 'home', access: 'public' })

const { t, te } = useI18n()
const route = useRoute()
const routeKey = computed(() => String(route.params.id ?? ''))
const { profile, error, loading, isOwnProfile, facts, occupationTagline }
  = usePublicUserPage(routeKey)

const headerMeta = computed(() => {
  const p = profile.value
  if (!p) return [] as string[]
  const location = p.location
    ? locationCatalogLabel(p.locationKey ?? '', p.location, t, te)
    : null
  return [p.role, location].filter(Boolean) as string[]
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
        :is-own="isOwnProfile"
        :tagline="occupationTagline"
        :meta="headerMeta"
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
