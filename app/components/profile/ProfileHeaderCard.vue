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
    targetType: AccountType
    targetId: string
    tagline?: string | null
    meta?: string[]
    followersLabel?: string | null
    pillVariant?: PillVariant
    pillLabel?: string
    avatarUrl?: string | null
  }>(),
  {
    tagline: null,
    meta: () => [],
    followersLabel: null,
    pillVariant: undefined,
    pillLabel: undefined,
    avatarUrl: null,
  },
)

const avatarFailed = ref(false)
const initials = computed(() => accountNamePrefix(props.name || '?'))
const avatarColor = computed(() => getAvatarColor(props.targetId || props.name))
const metaParts = computed(() =>
  props.meta.filter((part): part is string => Boolean(part && part.trim())),
)
</script>

<template>
  <div class="bg-card border border-line rounded-md shadow-1 overflow-hidden">
    <div
      class="h-[160px] sm:h-[200px] relative bg-[linear-gradient(120deg,#075056_0%,#0C6E6B_30%,#2C9A8E_65%,#BFE0DA_100%)]"
    />
    <div class="relative px-6 sm:px-8 pb-6">
      <img
        v-if="avatarUrl && !avatarFailed"
        :src="avatarUrl"
        class="-mt-14 size-[112px] sm:size-[132px] rounded-full object-cover border-4 border-card shadow-2 shrink-0"
        @error="avatarFailed = true"
      />
      <div
        v-else
        class="-mt-14 size-[112px] sm:size-[132px] rounded-full border-4 border-card shadow-2 flex items-center justify-center shrink-0"
        :style="{ backgroundImage: avatarColor }"
      >
        <span class="font-semibold text-[40px] sm:text-[44px] text-white">
          {{ initials }}
        </span>
      </div>

      <div
        class="mt-[18px] grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-7 items-end"
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
                class="size-[3px] rounded-full bg-ink-5 shrink-0"
                aria-hidden="true"
              />
              <span>{{ part }}</span>
            </template>
          </div>
          <p
            v-if="followersLabel"
            class="text-[13px] text-brand font-semibold mt-2.5"
          >
            {{ followersLabel }}
          </p>
        </div>
        <div class="flex gap-2 items-center">
          <FollowButton
            :target-type="targetType"
            :target-id="targetId"
          />
        </div>
      </div>
    </div>
  </div>
</template>
