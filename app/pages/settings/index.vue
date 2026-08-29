<script setup lang="ts">
import BaseIcon from '~/components/shared/BaseIcon.vue'
import BasePill from '~/components/shared/BasePill.vue'
import BaseSkeleton from '~/components/shared/BaseSkeleton.vue'
import { useUserProfile } from '~/composables/user/useUserProfile'

definePageMeta({ layout: 'home', access: 'protected' })

const { t } = useI18n()
const localePath = useLocalePath()
const { profile, refreshProfile, profileDetailsPending } = useUserProfile()

const avatarFailed = ref(false)

onMounted(async () => {
  await refreshProfile()
  avatarFailed.value = false
})

const userProfile = computed(() => profile.value?.profile ?? null)
const displayName = computed(
  () => userProfile.value?.name?.trim() || t('settings.info.unnamed'),
)
const role = computed(() => userProfile.value?.role ?? null)
const roleLabel = computed(() => {
  if (role.value === 'Investor') return t('common.role.investor')
  if (role.value === 'Founder') return t('common.role.founder')
  return null
})
const rolePillVariant = computed(() =>
  role.value === 'Investor' ? 'investor' : undefined,
)
const avatarUrl = computed(() => userProfile.value?.avatarUrl ?? null)
</script>

<template>
  <div class="mx-auto flex max-w-190 flex-col gap-4">
    <div>
      <h1 class="text-[22px] font-bold tracking-[-0.02em] text-ink">
        {{ t('settings.heading.settings') }}
      </h1>
      <p class="mt-1.5 max-w-[52ch] text-[14px] text-ink-3">
        {{ t('settings.info.subtitle') }}
      </p>
    </div>

    <section class="overflow-hidden rounded-md border border-line bg-card shadow-1">
      <div class="border-b border-line px-5 pt-4 pb-3">
        <h2 class="text-[14px] font-semibold text-ink">
          {{ t('settings.heading.you') }}
        </h2>
        <p class="mt-0.5 text-[12.5px] text-ink-4">
          {{ t('settings.info.you_section') }}
        </p>
      </div>

      <NuxtLink
        :to="localePath('/settings/profile')"
        class="flex items-center gap-3.5 px-5 py-4 no-underline transition-colors hover:bg-surface-hover"
        :class="{ 'pointer-events-none': profileDetailsPending }"
        :aria-busy="profileDetailsPending"
      >
        <template v-if="profileDetailsPending">
          <BaseSkeleton
            rounded="full"
            class="size-12 flex-none"
          />
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <BaseSkeleton class="h-4 w-36 max-w-full" />
              <BaseSkeleton class="h-5 w-16 rounded-full" />
            </div>
            <BaseSkeleton class="mt-2 h-3.5 w-44 max-w-full" />
          </div>
          <BaseSkeleton class="h-4 w-14 flex-none" />
        </template>

        <template v-else>
          <img
            v-if="avatarUrl && !avatarFailed"
            :src="avatarUrl"
            class="size-12 flex-none rounded-full border border-line object-cover"
            @error="avatarFailed = true"
          >
          <div
            v-else
            class="flex size-12 flex-none items-center justify-center rounded-full border border-line bg-surface-hover text-ink-4"
          >
            <BaseIcon
              name="person"
              size="1.4em"
            />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="truncate text-[14.5px] font-semibold text-ink">
                {{ displayName }}
              </p>
              <BasePill
                v-if="roleLabel"
                :variant="rolePillVariant"
              >
                {{ roleLabel }}
              </BasePill>
              <span
                v-else
                class="text-[12px] text-ink-4"
              >{{ t('settings.info.no_role') }}</span>
            </div>
            <p class="mt-1 text-[13px] text-ink-3">
              {{ t('settings.info.edit_profile_cta') }}
            </p>
          </div>

          <span class="flex-none text-[13px] font-semibold text-brand">
            {{ t('settings.action.edit') }} →
          </span>
        </template>
      </NuxtLink>
    </section>

    <section class="overflow-hidden rounded-md border border-line bg-card shadow-1">
      <div class="border-b border-line px-5 pt-4 pb-3">
        <h2 class="text-[14px] font-semibold text-ink">
          {{ t('settings.heading.security') }}
        </h2>
        <p class="mt-0.5 text-[12.5px] text-ink-4">
          {{ t('settings.info.security_section') }}
        </p>
      </div>

      <NuxtLink
        :to="localePath('/settings/password')"
        class="flex items-start justify-between gap-4 px-5 py-4 no-underline transition-colors hover:bg-surface-hover"
      >
        <div class="min-w-0">
          <p class="text-[14px] font-semibold text-ink">
            {{ t('settings.heading.password') }}
          </p>
          <p class="mt-1 text-[13px] text-ink-3">
            {{ t('settings.info.password_cta') }}
          </p>
        </div>
        <span class="mt-0.5 flex-none text-[13px] font-semibold text-brand">
          {{ t('settings.action.edit') }} →
        </span>
      </NuxtLink>
    </section>
  </div>
</template>
