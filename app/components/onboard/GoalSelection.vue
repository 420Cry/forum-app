<script setup lang="ts">
import type { goalsSelectionType } from "~/types/onboard/onboardType";
import TitleSection from "./shared/TitleSection.vue";
import { goalsSelection } from "~/constants/onboardContent";
import BaseCardSection from "./shared/BaseCardSection.vue";
import OnboardCardComponent from "./OnboardCardComponent.vue";

// TODO: Map goal fetched from backend
const goalList = ref(goalsSelection);

const handleRoleActive = (selectedRole: string) => {
  const updatedRoleList: goalsSelectionType[] = goalList.value.reduce(
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

  goalList.value = updatedRoleList;
};

const selectedGoal = computed(() => {
  const activeRole = goalList.value.find((goal) => goal.active);

  return activeRole?.goals;
});

const baseRoleClass =
  "text-xs px-4 py-2 font-semibold rounded-lg hover:bg-neutral-100 hover:text-primary-900 ";
const activeRoleClass = baseRoleClass + " bg-neutral-100 text-primary-900";
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
        v-for="goal in goalList"
        :key="goal.role"
        :class="goal.active ? activeRoleClass : baseRoleClass"
        @click="handleRoleActive(goal.role)"
      >
        {{ goal.role }}
      </button>
    </div>
  </div>

  <BaseCardSection>
    <OnboardCardComponent
      v-for="goal in selectedGoal"
      :key="goal.title"
      :icon-name="goal.iconName"
      :title="goal.title"
      :description="goal.subtitle"
      :active="false"
    />
  </BaseCardSection>
</template>
