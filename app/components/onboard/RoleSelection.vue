<script setup lang="ts">
import { ref } from 'vue'
import TitleSection from './shared/TitleSection.vue'
import OnboardCardComponent from './OnboardCardComponent.vue'
import { roleSelection } from '~/constants/onboardContent'
import type { roleSelectionType } from '~/types/onboard/onboardType'
import setElementActive from '~/utils/setActiveElement'

const { t } = useI18n()
const refRoles = ref(roleSelection)
const { onboardInfo } = useOnboard()

const handleSelectedRole = (activeRole: roleSelectionType) => {
  setElementActive<roleSelectionType>(activeRole, refRoles)
  onboardInfo.role = activeRole.roleTitle
}

onMounted(() => {
  if (onboardInfo.role) {
    refRoles.value = refRoles.value.map((role) => {
      return { ...role, active: onboardInfo.role === role.roleTitle }
    })
  }
})
</script>

<template>
  <TitleSection>
    <template #title>
      {{ t('onboard.heading.role_prompt') }}
    </template>
    <template #subtitle>
      {{ t('onboard.info.role_subtitle') }}
    </template>
  </TitleSection>

  <div class="grid w-full max-w-[760px] grid-cols-2 gap-[18px] mx-auto">
    <OnboardCardComponent
      v-for="role in refRoles"
      :key="role.roleTitle"
      :icon-name="role.iconName"
      :title="t(role.titleKey)"
      :description="t(role.descriptionKey)"
      :active="role.active"
      variants="roles"
      @click="handleSelectedRole(role)"
    />
  </div>
</template>
