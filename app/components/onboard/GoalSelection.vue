<script setup lang="ts">
import type {
  goalsSelectionType,
  goalTitlesType,
} from "~/types/onboard/onboardType";
import TitleSection from "./shared/TitleSection.vue";
import { goalsSelection } from "~/constants/onboardContent";
import BaseCardSection from "./shared/BaseCardSection.vue";
import OnboardCardComponent from "./OnboardCardComponent.vue";
import setElementActive from "~/utils/setActiveElement";
import RolesNav from "./RolesNav.vue";

//TODO: Map goal fetched from backend
const roleGoals: Ref<goalsSelectionType[]> = ref(goalsSelection);
const { onboardInfo } = useOnboard();

const setRoleActive = (selectedRoleGoal: goalsSelectionType) => {
  setElementActive<goalsSelectionType>(selectedRoleGoal, roleGoals);
};

const selectedGoalsList = computed(() => {
  const activeRole = roleGoals.value.find((goal) => goal.active);
  return activeRole?.goals;
});

const handleSelectedGoal = (goalTitle: goalTitlesType) => {
  const activeGoal = selectedGoalsList.value?.find(
    (goal) => goal.title === goalTitle,
  );
  if (activeGoal && !activeGoal.active) {
    activeGoal.active = true;
    onboardInfo.goals.push(goalTitle);
  } else if (activeGoal && activeGoal.active) {
    activeGoal.active = false;
    onboardInfo.goals = onboardInfo.goals.filter(
      (title) => title !== goalTitle,
    );
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
      <RolesNav
        v-for="roleGoal in roleGoals"
        :key="roleGoal.role"
        :active="roleGoal.active"
        @role-click="setRoleActive(roleGoal)"
      >
        {{ roleGoal.role }}
      </RolesNav>
    </div>
  </div>

  <BaseCardSection>
    <OnboardCardComponent
      v-for="goal in selectedGoalsList"
      :key="goal.title"
      :icon-name="goal.iconName"
      :title="goal.title"
      :description="goal.subtitle"
      :active="goal.active"
      size="1.5em"
      variants="goals"
      @click="handleSelectedGoal(goal.title)"
    />
  </BaseCardSection>
</template>
