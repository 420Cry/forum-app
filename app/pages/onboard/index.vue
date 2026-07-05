<script setup lang="ts">
import OnboardNav from '@/components/onboard/shared/OnboardNav.vue'
import OnboardProgress from '@/components/onboard/shared/OnboardProgress.vue'
import { isOnboardingComplete } from '~/types/user'

definePageMeta({ layout: 'onboard' })

const {
  currentPage,
  currentStep,
  currentStepLabel,
  onboardPage,
  bumpStep,
  backStep,
  updateOnboardPage,
  hydrateFromProfile,
} = useOnboard()
const { refreshProfile } = useUserProfile()

const totalSteps = onboardPage.value.length

onMounted(async () => {
  const me = await refreshProfile(true)
  const userProfile = me?.profile ?? null

  if (isOnboardingComplete(userProfile)) {
    await navigateTo('/home')
    return
  }

  hydrateFromProfile(userProfile)
  updateOnboardPage()
})
</script>

<template>
  <OnboardProgress
    :step="currentStep"
    :total-steps="totalSteps"
    :label="currentStepLabel"
  />

  <main class="flex-1 flex flex-col items-center px-8 pt-14 pb-10">
    <component :is="currentPage" />
  </main>

  <OnboardNav
    :current-step="currentStep"
    :total-steps="totalSteps"
    @next-page="bumpStep"
    @back-page="backStep"
  />
</template>
