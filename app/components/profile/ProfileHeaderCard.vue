<script setup lang="ts">
import BasePill from '~/components/shared/BasePill.vue'
import FollowButton from '~/components/social/FollowButton.vue'
import type { AccountType } from '~/types/profile'
import type { PillVariant } from '~/utils/stagePill'
import { getAvatarColor } from '~/utils/avatarColor'
import { accountNamePrefix } from '~/utils/accountSummary'

export type ProfileStat = {
  key: string
  count: number
  label: string
  to?: string
}

const props = withDefaults(
  defineProps<{
    name: string
    targetType: AccountType
    targetId: string
    /** For org pages: hide Follow when the viewer owns the page. */
    ownerUserId?: string | null
    /** Owner viewing their own public profile — show Edit instead of Follow. */
    isOwn?: boolean
    tagline?: string | null
    meta?: string[]
    stats?: ProfileStat[]
    pillVariant?: PillVariant
    pillLabel?: string
    avatarUrl?: string | null
  }>(),
  {
    ownerUserId: null,
    isOwn: false,
    tagline: null,
    meta: () => [],
    stats: () => [],
    pillVariant: undefined,
    pillLabel: undefined,
    avatarUrl: null,
  },
)

const emit = defineEmits<{
  'follow-change': [following: boolean]
}>()

const localePath = useLocalePath()
const { t } = useI18n()
const avatarFailed = ref(false)
const initials = computed(() => accountNamePrefix(props.name || '?'))
const avatarColor = computed(() => getAvatarColor(props.targetId || props.name))
const metaParts = computed(() =>
  props.meta.filter((part): part is string => Boolean(part && part.trim())),
)

const localStats = ref<ProfileStat[]>([])
watch(
  () => props.stats,
  (next) => {
    localStats.value = next.map(stat => ({ ...stat }))
  },
  { immediate: true, deep: true },
)

function onFollowChange(following: boolean) {
  const followers = localStats.value.find(s => s.key === 'followers')
  if (followers) {
    followers.count = Math.max(0, followers.count + (following ? 1 : -1))
  }
  emit('follow-change', following)
}

const editProfileClass
  = 'inline-flex items-center justify-center gap-1.5 font-semibold rounded-pill transition-colors cursor-pointer select-none whitespace-nowrap text-center border border-brand text-brand bg-transparent hover:bg-brand-tint px-3 py-1.5 text-[12.5px] leading-none min-h-8 no-underline'

const statLinkClass
  = 'inline-flex items-baseline gap-1.5 no-underline text-ink hover:opacity-80 transition-opacity'
const statPlainClass = 'inline-flex items-baseline gap-1.5 text-ink'
</script>

<template>
  <div class="bg-card border border-line rounded-md shadow-1 overflow-hidden">
    <div
      class="relative h-40 bg-[linear-gradient(120deg,#075056_0%,#0C6E6B_30%,#2C9A8E_65%,#BFE0DA_100%)] sm:h-50"
    />
    <div class="relative px-6 sm:px-8 pb-6">
      <img
        v-if="avatarUrl && !avatarFailed"
        :src="avatarUrl"
        class="-mt-14 size-28 sm:size-33 rounded-full object-cover border-4 border-card shadow-2 shrink-0"
        @error="avatarFailed = true"
      />
      <div
        v-else
        class="-mt-14 size-28 sm:size-33 rounded-full border-4 border-card shadow-2 flex items-center justify-center shrink-0"
        :style="{ backgroundImage: avatarColor }"
      >
        <span class="font-semibold text-[40px] sm:text-[44px] text-white">
          {{ initials }}
        </span>
      </div>

      <div
        class="mt-4.5 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-7 items-end"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-3 flex-wrap">
            <h1
              class="text-[26px] sm:text-[28px] font-bold text-ink tracking-[-0.022em] leading-tight"
            >
              {{ name }}
            </h1>
            <BasePill
              v-if="pillVariant || pillLabel"
              :variant="pillVariant"
            >
              {{ pillLabel }}
            </BasePill>
          </div>
          <p
            v-if="tagline"
            class="text-[15px] text-ink-3 mt-1.5 max-w-[64ch]"
          >
            {{ tagline }}
          </p>
          <div
            v-if="metaParts.length"
            class="flex items-center gap-3.5 flex-wrap text-[13px] text-ink-4 mt-2.5"
          >
            <template
              v-for="(part, index) in metaParts"
              :key="`${part}-${index}`"
            >
              <span
                v-if="index > 0"
                class="size-0.75 rounded-full bg-ink-5 shrink-0"
                aria-hidden="true"
              />
              <span>{{ part }}</span>
            </template>
          </div>
          <div
            v-if="localStats.length"
            class="flex items-center gap-5 flex-wrap mt-3"
          >
            <component
              :is="stat.to ? 'NuxtLink' : 'span'"
              v-for="stat in localStats"
              :key="stat.key"
              v-bind="stat.to ? { to: localePath(stat.to) } : {}"
              :class="stat.to ? statLinkClass : statPlainClass"
            >
              <span class="text-[15px] font-semibold tabular-nums">
                {{ stat.count }}
              </span>
              <span class="text-[13px] text-ink-4 font-medium">
                {{ stat.label }}
              </span>
            </component>
          </div>
        </div>
        <div class="flex gap-2 items-center">
          <NuxtLink
            v-if="isOwn"
            :to="localePath('/settings/profile')"
            :class="editProfileClass"
          >
            {{ t('profiles.action.edit_profile') }}
          </NuxtLink>
          <FollowButton
            v-else
            :target-type="targetType"
            :target-id="targetId"
            :owner-user-id="ownerUserId"
            @change="onFollowChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
