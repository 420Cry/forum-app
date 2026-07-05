<script setup lang="ts">
import type {
  goalsSelectionType,
  goalTitlesType,
} from '~/types/onboard/onboardType'
import TitleSection from './shared/TitleSection.vue'
import BaseIcon from '../shared/BaseIcon.vue'
import { goalsSelection } from '~/constants/onboardContent'
import type { iconNameType } from '~/types/iconType'

const { t } = useI18n()
const { onboardInfo, goalsRole } = useOnboard()

type MutableGoal = {
  iconName: iconNameType
  title: string
  titleKey: string
  subtitleKey: string
  active: boolean
}

const goalsByRole = ref<MutableGoal[]>([])

const isRoleChange
  = goalsRole.value !== '' && goalsRole.value !== onboardInfo.role
if (isRoleChange) {
  onboardInfo.goals = []
}
goalsRole.value = onboardInfo.role

const match = goalsSelection.find(g => g.role === onboardInfo.role)
const matchGoal = match ?? (goalsSelection[0] as goalsSelectionType)
goalsByRole.value = matchGoal.goals.map(g => ({
  ...g,
  active: onboardInfo.goals.includes(g.title as goalTitlesType),
}))

const selectedCount = computed(
  () => goalsByRole.value.filter(g => g.active).length,
)

const toggleGoal = (goal: MutableGoal) => {
  goal.active = !goal.active
  const title = goal.title as goalTitlesType
  if (goal.active) {
    onboardInfo.goals.push(title)
  }
  else {
    onboardInfo.goals = onboardInfo.goals.filter(item => item !== title)
  }
}
</script>

<template>
  <TitleSection>
    <template #title>
      {{ t('onboard.heading.goals') }}
    </template>
    <template #subtitle>
      {{ t('onboard.info.goals_subtitle') }}
    </template>
  </TitleSection>

  <div class="mx-auto w-full max-w-[760px]">
    <div class="grid grid-cols-2 gap-[14px]">
      <div
        v-for="goal in goalsByRole"
        :key="goal.title"
        class="flex gap-[14px] items-start px-5 py-[18px] bg-card border-[1.5px] rounded-[var(--radius-md)] cursor-pointer transition-colors"
        :class="
          goal.active
            ? 'border-brand bg-brand-tint'
            : 'border-line hover:border-line-2'
        "
        @click="toggleGoal(goal)"
      >
        <span
          class="relative flex-none w-[18px] h-[18px] rounded-[4px] border-[1.5px] mt-px transition-colors"
          :class="
            goal.active ? 'bg-brand border-brand' : 'bg-card border-line-2'
          "
        >
          <svg
            v-if="goal.active"
            class="absolute inset-0 m-auto"
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <BaseIcon
              :name="goal.iconName"
              size="1em"
              :class="goal.active ? 'text-brand' : 'text-ink-3'"
            />
            <span class="text-[14.5px] font-semibold text-ink">{{
              t(goal.titleKey)
            }}</span>
          </div>
          <p class="mt-1 text-[13px] text-ink-3 leading-[1.5]">
            {{ t(goal.subtitleKey) }}
          </p>
        </div>
      </div>
    </div>

    <p class="mt-[18px] text-center text-[13px] text-ink-4">
      <b class="text-brand font-semibold">{{
        t('common.info.selected_count', { count: selectedCount })
      }}</b>
      &nbsp;·&nbsp;{{ t('common.info.update_anytime') }}
    </p>
  </div>
</template>
