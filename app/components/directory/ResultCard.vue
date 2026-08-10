<script setup lang="ts">
import BasePill from '~/components/shared/BasePill.vue'
import FollowButton from '~/components/social/FollowButton.vue'
import type { AccountType } from '~/types/profile'
import type { PillVariant } from '~/utils/stagePill'
import { getAvatarColor } from '~/utils/avatarColor'
import { accountNamePrefix } from '~/utils/accountSummary'
import { buttonClass } from '~/utils/buttonClass'

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

const emit = defineEmits<{
  followChange: [payload: { targetType: AccountType, targetId: string, following: boolean }]
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const avatarFailed = ref(false)

const initials = computed(() => accountNamePrefix(props.name || '?'))
const avatarColor = computed(() => getAvatarColor(props.targetId || props.name))

const metaParts = computed(() =>
  props.meta.filter((part): part is string => Boolean(part && part.trim())),
)

function onFollowChange(following: boolean) {
  emit('followChange', {
    targetType: props.targetType,
    targetId: props.targetId,
    following,
  })
}

/** Match BaseButton sm + secondary so Follow / View profile share one footprint. */
const viewProfileClass = computed(() =>
  `${buttonClass({ intent: 'secondary', size: 'sm', block: true })} no-underline`,
)

const profileTo = computed(() => localePath(props.href))
</script>

<template>
  <article
    class="relative grid grid-cols-[56px_minmax(0,1fr)] lg:grid-cols-[56px_minmax(0,1fr)_132px] items-start gap-x-4 gap-y-3.5 bg-card px-5 py-4.5 shadow-1 transition-shadow sm:gap-x-4.5 lg:items-center border border-line rounded-md hover:border-line-2 hover:shadow-2"
    :class="{ 'border-l-[3px] border-l-accent': opportunity }"
  >
    <span
      v-if="opportunity"
      class="absolute top-3.5 right-4.5 text-[9.5px] font-bold uppercase tracking-[0.08em] px-2 py-1 rounded-sm bg-accent-soft text-accent-text"
    >
      {{ t('social.badge.opportunity') }}
    </span>

    <NuxtLink
      :to="profileTo"
      class="size-14 shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      :aria-label="name"
    >
      <img
        v-if="avatarUrl && !avatarFailed"
        :src="avatarUrl"
        class="size-14 rounded-full object-cover"
        @error="avatarFailed = true"
      />
      <div
        v-else
        class="size-14 rounded-full flex justify-center items-center shadow-1"
        :style="{ backgroundImage: avatarColor }"
      >
        <span class="font-semibold text-[20px] text-white">
          {{ initials }}
        </span>
      </div>
    </NuxtLink>

    <div class="min-w-0 lg:pr-2">
      <div class="flex items-center gap-2.5 flex-wrap">
        <NuxtLink
          :to="profileTo"
          class="text-[17px] font-bold text-ink tracking-[-0.012em] no-underline hover:underline"
        >
          {{ name }}
        </NuxtLink>
        <BasePill
          v-if="pillVariant || pillLabel"
          :variant="pillVariant"
        >
          {{ pillLabel }}
        </BasePill>
      </div>
      <p
        v-if="industry"
        class="text-[13px] text-ink-3 mt-0.75"
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
            class="size-0.75 rounded-full bg-ink-5 shrink-0"
            aria-hidden="true"
          />
          <span>{{ part }}</span>
        </template>
        <template v-if="opportunity && opportunityDetail">
          <span
            class="size-0.75 rounded-full bg-ink-5 shrink-0"
            aria-hidden="true"
          />
          <span class="text-accent-text font-semibold">{{
            opportunityDetail
          }}</span>
        </template>
      </div>
    </div>

    <div
      class="col-span-2 lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 w-full min-w-0 lg:min-w-33"
    >
      <FollowButton
        v-if="showFollow"
        block
        :target-type="targetType"
        :target-id="targetId"
        @change="onFollowChange"
      />
      <NuxtLink
        :to="profileTo"
        :class="[
          viewProfileClass,
          !showFollow ? 'col-span-2 lg:col-span-1' : '',
        ]"
      >
        {{ t('find.action.view_profile') }}
      </NuxtLink>
    </div>
  </article>
</template>
