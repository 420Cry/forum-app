<script setup lang="ts">
import type { goalsSelectionType } from "~/types/onboard/onboardType";
import TitleSection from "./shared/TitleSection.vue";
import { goalsSelection } from "~/constants/onboardContent";
import BaseCardSection from "./shared/BaseCardSection.vue";
import OnboardCardComponent from "./OnboardCardComponent.vue";

// TODO: Map goal fetched from backend
const roleGoals: Ref<goalsSelectionType[]> = ref(goalsSelection);
const baseRoleClass =
  "text-xs px-4 py-2 font-semibold rounded-lg hover:bg-neutral-100 hover:text-primary-900 md:text-sm";
const activeRoleClass = baseRoleClass + " bg-neutral-100 text-primary-900";

const setRoleActive = (selectedRole: string) => {
  const updatedRoleList: goalsSelectionType[] = roleGoals.value.reduce(
    (acc: goalsSelectionType[], curr: goalsSelectionType) => {
      if (curr.role === selectedRole) {
        curr.active = true;
      } else {
        curr.active = false;
      }
      acc.push(curr);
      return acc;
    },
    [],
  );

  roleGoals.value = updatedRoleList;
};

const selectedGoals = computed(() => {
  const activeRole = roleGoals.value.find((goal) => goal.active);
  return activeRole?.goals;
});

const setGoalActive = (goalTitle: string) => {
  const activeGoal = selectedGoals.value?.find(
    (goal) => goal.title === goalTitle,
  );
  if (activeGoal && !activeGoal.active) {
    activeGoal.active = true;
  } else if (activeGoal && activeGoal.active) {
    activeGoal.active = false;
  }
};
</script>
<template>
  <TitleSection>
    <template #title>What are your main goals?</template>
    <template #subtitle
      >Select all that apply to help us personalize your experience.</template
    >
  </TitleSection>

  <div class="flex justify-center mt-6">
    <div class="p-2 flex justify-center gap-2 bg-primary-100 rounded-2xl">
      <button
        v-for="goal in roleGoals"
        :key="goal.role"
        :class="goal.active ? activeRoleClass : baseRoleClass"
        @click="setRoleActive(goal.role)"
      >
        {{ goal.role }}
      </button>
    </div>
  </div>

  <BaseCardSection>
    <OnboardCardComponent
      v-for="goal in selectedGoals"
      :key="goal.title"
      :icon-name="goal.iconName"
      :title="goal.title"
      :description="goal.subtitle"
      :active="goal.active"
      size="1.5em"
      variants="goals"
      @click="setGoalActive(goal.title)"
    />
  </BaseCardSection>
</template>
