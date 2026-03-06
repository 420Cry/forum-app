<script setup lang="ts">
import { ref } from "vue";
import TitleSection from "./shared/TitleSection.vue";
import OnboardCardComponent from "./OnboardCardComponent.vue";
import {
  roleSelection,
  type roleSelectionType,
} from "~/constants/onboardContent";
// Build active state for card
const refRoles = ref(roleSelection);

const setActive = (activeRole: roleSelectionType) => {
  const newRoleList: roleSelectionType[] = refRoles.value.reduce(
    (acc: roleSelectionType[], curr: roleSelectionType) => {
      curr === activeRole ? (curr.active = true) : (curr.active = false);
      acc.push(curr);
      return acc;
    },
    [],
  );

  refRoles.value = newRoleList;
};
</script>

<template>
  <TitleSection>
    <template #title> What is your role on Fundedr?</template>
    <template #subtitle>
      Choose the role that best describes your intent.</template
    >
  </TitleSection>

  <div
    class="mx-auto flex flex-wrap flex-col gap-6 items-center lg:flex-row justify-center"
  >
    <OnboardCardComponent
      v-for="role in refRoles"
      @click="setActive(role)"
      :iconName="role.iconName"
      :title="role.title"
      :description="role.description"
      :active="role.active"
      :key="role.title"
    />
  </div>
</template>
