<script setup lang="ts">
import { ref } from "vue";
import TitleSection from "./shared/TitleSection.vue";
import OnboardCardComponent from "./OnboardCardComponent.vue";
import { roleSelection } from "~/constants/onboardContent";
import type { roleSelectionType } from "~/types/onboard/onboardType";
import setElementActive from "~/utils/setActiveElement";

const refRoles = ref(roleSelection);
const { onboardInfo } = useOnboard();

const handleSelectedRole = (activeRole: roleSelectionType) => {
  setElementActive<roleSelectionType>(activeRole, refRoles);
  onboardInfo.role = activeRole.roleTitle;
};

onMounted(() => {
  if (onboardInfo.role) {
    refRoles.value = refRoles.value.map((role) => {
      return { ...role, active: onboardInfo.role === role.roleTitle };
    });
  }
});
</script>

<template>
  <TitleSection>
    <template #title>What brings you to Fundedr?</template>
    <template #subtitle>
      Pick the option that fits you best. You can hold both roles later — this
      just sets up your home feed.
    </template>
  </TitleSection>

  <div class="grid w-full max-w-[760px] grid-cols-2 gap-[18px] mx-auto">
    <OnboardCardComponent
      v-for="role in refRoles"
      :key="role.title"
      :icon-name="role.iconName"
      :title="role.title"
      :description="role.description"
      :active="role.active"
      variants="roles"
      @click="handleSelectedRole(role)"
    />
  </div>
</template>
