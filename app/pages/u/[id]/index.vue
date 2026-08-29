<script setup lang="ts">
import ProfileAboutCard from '~/components/profile/ProfileAboutCard.vue'
import ProfileHeaderCard from '~/components/profile/ProfileHeaderCard.vue'
import FollowListSheet from '~/components/profile/FollowListSheet.vue'
import { usePublicUserPage } from '~/composables/profile/usePublicUserPage'
import { useProfileFollowSheet } from '~/composables/social/useProfileFollowSheet'
import { locationCatalogLabel } from '~/utils/catalogLabel'
import { adjustFollowCount } from '~/utils/followCount'

definePageMeta({ layout: 'home', access: 'public' })

const { t, te } = useI18n()
const route = useRoute()
const routeKey = computed(() => String(route.params.id ?? ''))
const { profile, error, loading, isOwnProfile, facts, occupationTagline }
  = usePublicUserPage(routeKey)

const { sheetOpen, sheetMode, onStatClick } = useProfileFollowSheet()

const headerMeta = computed(() => {
  const p = profile.value
  if (!p) return [] as string[]
  const location = p.location
    ? locationCatalogLabel(p.locationKey ?? '', p.location, t, te)
    : null
  return [p.role, location].filter(Boolean) as string[]
})

const headerStats = computed(() => {
  const p = profile.value
  if (!p) return []
  return [
    {
      key: 'followers',
      count: p.followersCount ?? 0,
      label: t('profiles.stat.followers'),
      interactive: true,
    },
    {
      key: 'following',
      count: p.followingCount ?? 0,
      label: t('profiles.stat.following'),
      interactive: true,
    },
  ]
})

const sheetTitle = computed(() =>
  sheetMode.value === 'followers'
    ? t('profiles.heading.followers')
    : t('profiles.heading.following'),
)

const sheetEmpty = computed(() =>
  sheetMode.value === 'followers'
    ? t('profiles.info.followers_empty')
    : t('profiles.info.following_empty'),
)

const sheetError = computed(() =>
  sheetMode.value === 'followers'
    ? t('profiles.info.followers_error')
    : t('profiles.info.following_error'),
)

/** Follow / unfollow from sheets on your own profile changes your following count. */
function onSheetFollowChange(payload: { following: boolean }) {
  if (!isOwnProfile.value || !profile.value) return
  profile.value = {
    ...profile.value,
    followingCount: adjustFollowCount(
      profile.value.followingCount,
      payload.following,
    ),
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <ProfilePageSkeleton v-if="loading" />
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
        :stats="headerStats"
        :pill-variant="profile.role === 'Investor' ? 'investor' : undefined"
        :pill-label="profile.role ?? undefined"
        :avatar-url="profile.avatarUrl"
        @stat-click="onStatClick"
      />
      <ProfileAboutCard
        :about="null"
        :facts="facts"
      />
      <FollowListSheet
        v-model:open="sheetOpen"
        :title="sheetTitle"
        :mode="sheetMode"
        target-type="user"
        :target-id="profile.id"
        :user-id="profile.id"
        :empty-message="sheetEmpty"
        :error-message="sheetError"
        @follow-change="onSheetFollowChange"
      />
    </template>
  </div>
</template>
