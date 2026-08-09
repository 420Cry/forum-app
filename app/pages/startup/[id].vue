<script setup lang="ts">
import ProfileHeaderCard from '~/components/profile/ProfileHeaderCard.vue'
import ProfileAboutCard from '~/components/profile/ProfileAboutCard.vue'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import type { StartupProfile } from '~/types/profile'
import { stageToPillVariant } from '~/utils/stagePill'

definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const { getStartup } = useProfilesApi()

const id = computed(() => String(route.params.id ?? ''))
const profile = ref<StartupProfile | null>(null)
const error = ref(false)
const loading = ref(true)

onMounted(async () => {
  try {
    profile.value = await getStartup(id.value)
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

const facts = computed(() => {
  const p = profile.value
  if (!p) return []
  const rows: { key: string, value: string }[] = [
    {
      key: t('profiles.fact.stage'),
      value: t(`profiles.stage.${p.stage}`),
    },
    { key: t('profiles.fact.industry'), value: p.industry },
  ]
  if (p.foundedAt) {
    rows.push({
      key: t('profiles.fact.founded'),
      value: p.foundedAt.slice(0, 10),
    })
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
        :name="profile.companyName"
        target-type="startup"
        :target-id="profile.id"
        :tagline="profile.description"
        :meta="[profile.industry]"
        :followers-label="
          t('profiles.info.stats', {
            views: profile.views,
            connections: profile.connections,
          })
        "
        :pill-variant="stageToPillVariant(profile.stage)"
        :pill-label="t(`profiles.stage.${profile.stage}`)"
        :avatar-url="avatar"
      />
      <ProfileAboutCard
        :about="profile.description"
        :facts="facts"
      />
    </template>
  </div>
</template>
