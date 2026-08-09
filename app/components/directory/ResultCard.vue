<script setup lang="ts">
import BasePill from '~/components/shared/BasePill.vue'
import FollowButton from '~/components/social/FollowButton.vue'
import type { AccountType } from '~/types/profile'
import type { PillVariant } from '~/utils/stagePill'
import { getAvatarColor } from '~/utils/avatarColor'
import { accountNamePrefix } from '~/utils/accountSummary'

const props = withDefaults(
  defineProps<{
    name: string
    href: string
    targetType: AccountType
    targetId: string
    industry?: string | null
    description?: string | null
    meta?: string[]
    pillVariant?: PillVariant
    pillLabel?: string
    avatarUrl?: string | null
    opportunity?: boolean
    opportunityDetail?: string | null
    showFollow?: boolean
  }>(),
  {
    industry: null,
    description: null,
    meta: () => [],
    pillVariant: undefined,
    pillLabel: undefined,
    avatarUrl: null,
    opportunity: false,
    opportunityDetail: null,
    showFollow: true,
  },
)

const { t } = useI18n()
const localePath = useLocalePath()
const avatarFailed = ref(false)

const initials = computed(() => accountNamePrefix(props.name || '?'))
const avatarColor = computed(() => getAvatarColor(props.targetId || props.name))

const metaParts = computed(() =>
  props.meta.filter((part): part is string => Boolean(part && part.trim())),
)
</script>

<template>
  <article
    class="relative grid grid-cols-1 sm:grid-cols-[64px_1fr] lg:grid-cols-[64px_1fr_auto] gap-4 sm:gap-[18px] items-center bg-card border border-line rounded-md shadow-1 px-5 py-[18px] transition-shadow hover:shadow-2 hover:border-line-2"
    :class="{ 'border-l-[3px] border-l-accent': opportunity }"
  >
    <span
      v-if="opportunity"
      class="absolute top-3.5 right-[18px] text-[9.5px] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-sm bg-accent-soft text-accent-text"
    >
      {{ t('social.badge.opportunity') }}
    </span>

    <img
      v-if="avatarUrl && !avatarFailed"
      :src="avatarUrl"
      class="size-14 rounded-full object-cover shrink-0"
      @error="avatarFailed = true"
    />
    <div
      v-else
      class="size-14 rounded-full flex justify-center items-center shrink-0 shadow-1"
      :style="{ backgroundImage: avatarColor }"
    >
      <span class="font-semibold text-[20px] text-white">
        {{ initials }}
      </span>
    </div>

    <div class="min-w-0 sm:pr-[18px]">
      <div class="flex items-center gap-2.5 flex-wrap">
        <span class="text-[17px] font-bold text-ink tracking-[-0.012em]">
          {{ name }}
        </span>
        <BasePill
          v-if="pillVariant || pillLabel"
          :variant="pillVariant"
        >
          {{ pillLabel }}
        </BasePill>
      </div>
      <p
        v-if="industry"
        class="text-[13px] text-ink-3 mt-[3px]"
      >
        {{ industry }}
      </p>
      <p
        v-if="description"
        class="text-[13.5px]/relaxed text-ink-3 mt-2 line-clamp-2 max-w-[60ch]"
      >
        {{ description }}
      </p>
      <div
        v-if="metaParts.length || opportunityDetail"
        class="flex items-center gap-3.5 flex-wrap text-xs text-ink-4 mt-2.5"
      >
        <template
          v-for="(part, index) in metaParts"
          :key="`${part}-${index}`"
        >
          <span
            v-if="index > 0"
            class="size-[3px] rounded-full bg-ink-5 shrink-0"
            aria-hidden="true"
          />
          <span>{{ part }}</span>
        </template>
        <template v-if="opportunity && opportunityDetail">
          <span
            class="size-[3px] rounded-full bg-ink-5 shrink-0"
            aria-hidden="true"
          />
          <span class="text-accent-text font-semibold">{{
            opportunityDetail
          }}</span>
        </template>
      </div>
    </div>

    <div
      class="flex flex-row sm:flex-col gap-2 items-stretch min-w-0 sm:min-w-[124px]"
    >
      <FollowButton
        v-if="showFollow"
        :target-type="targetType"
        :target-id="targetId"
      />
      <NuxtLink
        :to="localePath(href)"
        class="inline-flex items-center justify-center gap-1.5 font-semibold rounded-pill transition-colors cursor-pointer select-none border border-line text-ink-2 bg-card hover:bg-surface-hover hover:border-line-2 px-3 py-1.5 text-xs no-underline w-full"
      >
        {{ t('find.action.view_profile') }}
      </NuxtLink>
    </div>
  </article>
</template>
