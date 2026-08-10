<script setup lang="ts">
import ProfileAboutCard from '~/components/profile/ProfileAboutCard.vue'
import ProfileHeaderCard from '~/components/profile/ProfileHeaderCard.vue'
import { usePublicUserPage } from '~/composables/profile/usePublicUserPage'

definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const route = useRoute()
const routeKey = computed(() => String(route.params.id ?? ''))
const { profile, error, loading, isOwnProfile, facts } = usePublicUserPage(routeKey)
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
      <p
        v-if="isOwnProfile"
        class="rounded-md border border-brand/20 bg-brand-tint px-4 py-2.5 text-[13px] text-ink-2"
      >
        {{ t('profiles.info.own_preview') }}
      </p>
      <ProfileHeaderCard
        :name="profile.name || t('profiles.info.unnamed')"
        target-type="user"
        :target-id="profile.id"
        :is-own="isOwnProfile"
        :tagline="profile.occupation"
        :meta="[profile.role, profile.location].filter(Boolean) as string[]"
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
