<script setup lang="ts">
import FollowButton from '~/components/social/FollowButton.vue'
import { useProfilesApi } from '~/composables/api/useProfilesApi'
import type { PublicUserProfile } from '~/types/profile'
import { getAvatarColor } from '~/utils/avatarColor'
import { accountNamePrefix } from '~/utils/accountSummary'

definePageMeta({ layout: 'home', access: 'public' })

const { t } = useI18n()
const route = useRoute()
const { getPublicUser } = useProfilesApi()

const id = computed(() => String(route.params.id ?? ''))
const profile = ref<PublicUserProfile | null>(null)
const error = ref(false)
const loading = ref(true)
const avatarFailed = ref(false)

onMounted(async () => {
  try {
    profile.value = await getPublicUser(id.value)
  }
  catch {
    error.value = true
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-5xl px-7 py-6">
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
    <div
      v-else
      class="bg-card border border-line rounded-md shadow-1 px-8 py-7"
    >
      <div class="flex items-start gap-5">
        <img
          v-if="profile.avatarUrl && !avatarFailed"
          :src="profile.avatarUrl"
          class="size-20 rounded-full object-cover shrink-0"
          @error="avatarFailed = true"
        />
        <div
          v-else
          class="size-20 rounded-full flex justify-center items-center shrink-0"
          :style="{ backgroundImage: getAvatarColor(profile.id) }"
        >
          <span class="font-semibold text-lg text-white">
            {{ accountNamePrefix(profile.name ?? '?') }}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-xl font-semibold text-ink">
                {{ profile.name || t('profiles.info.unnamed') }}
              </h1>
              <p class="text-sm text-ink-3 mt-1">
                {{
                  [profile.role, profile.occupation, profile.location]
                    .filter(Boolean)
                    .join(' · ')
                }}
              </p>
            </div>
            <FollowButton
              target-type="user"
              :target-id="profile.id"
            />
          </div>
          <div
            v-if="profile.goals.length"
            class="flex flex-wrap gap-2 mt-4"
          >
            <span
              v-for="goal in profile.goals"
              :key="goal"
              class="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-tint text-brand"
            >
              {{ goal }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
