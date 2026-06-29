<script setup lang="ts">
import type {
  goalsSelectionType,
  goalTitlesType,
} from "~/types/onboard/onboardType";
import TitleSection from "./shared/TitleSection.vue";
import BaseIcon from "../shared/BaseIcon.vue";
import { goalsSelection } from "~/constants/onboardContent";
import type { iconNameType } from "~/types/iconType";

const { onboardInfo } = useOnboard();

type MutableGoal = {
  iconName: iconNameType;
  title: string;
  subtitle: string;
  active: boolean;
};

const goalsByRole = ref<MutableGoal[]>([]);

watch(
  () => onboardInfo.role,
  (newRole, oldRole) => {
    const isRoleChange = oldRole !== undefined && oldRole !== newRole;
    if (isRoleChange) {
      onboardInfo.goals = [];
    }
    const match = goalsSelection.find((g) => g.role === newRole);
    const matchGoal = match ?? (goalsSelection[0] as goalsSelectionType);
    goalsByRole.value = matchGoal.goals.map((g) => ({
      ...g,
      active: onboardInfo.goals.includes(g.title as goalTitlesType),
    }));
  },
  { immediate: true },
);

const selectedCount = computed(
  () => goalsByRole.value.filter((g) => g.active).length,
);

const toggleGoal = (goal: MutableGoal) => {
  goal.active = !goal.active;
  const title = goal.title as goalTitlesType;
  if (goal.active) {
    onboardInfo.goals.push(title);
  } else {
    onboardInfo.goals = onboardInfo.goals.filter((t) => t !== title);
  }
};
</script>

<template>
  <TitleSection>
    <template #title>What are your goals?</template>
    <template #subtitle>
      Pick the ones that fit. We'll use this to tailor your home feed and
      recommendations. You can select more than one.
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
        <!-- Square checkbox -->
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

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <BaseIcon
              :name="goal.iconName"
              size="1em"
              :class="goal.active ? 'text-brand' : 'text-ink-3'"
            />
            <span class="text-[14.5px] font-semibold text-ink">{{ goal.title }}</span>
          </div>
          <p class="mt-1 text-[13px] text-ink-3 leading-[1.5]">{{ goal.subtitle }}</p>
        </div>
      </div>
    </div>

    <p class="mt-[18px] text-center text-[13px] text-ink-4">
      <b class="text-brand font-semibold">{{ selectedCount }} selected</b>
      &nbsp;·&nbsp;You can update these any time from your profile
    </p>
  </div>
</template>
