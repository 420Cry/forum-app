<script setup lang="ts">
import OnboardNav from '@/components/onboard/shared/OnboardNav.vue'
import OnboardProgress from '@/components/onboard/shared/OnboardProgress.vue'
import { isOnboardingComplete } from '~/types/user'

definePageMeta({ layout: 'onboard', access: 'protected' })

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()
const {
  currentPage,
  currentStep,
  currentStepLabel,
  totalSteps,
  bumpStep,
  backStep,
  updateOnboardPage,
  hydrateFromProfile,
  restoreOnboardSession,
  enableDraftSync,
  isLoading,
} = useOnboard()
const { refreshProfile, unauthorized, loading: profileLoading } = useUserProfile()

const pageReady = ref(false)

onMounted(async () => {
  const me = await refreshProfile(false)

  if (unauthorized.value) {
    toast.showError(t('auth.error.session_invalid'), 4000)
    await navigateTo(localePath('/auth/login'))
    return
  }

  const userProfile = me?.profile ?? null

  if (isOnboardingComplete(userProfile)) {
    await navigateTo(localePath('/social'), { replace: true })
    return
  }

  if (restoreOnboardSession(userProfile)) {
    enableDraftSync()
    pageReady.value = true
    return
  }

  hydrateFromProfile(userProfile)
  updateOnboardPage()
  enableDraftSync()
  pageReady.value = true
})
</script>

<template>
  <OnboardProgress
    v-if="pageReady"
    :step="currentStep"
    :total-steps="totalSteps"
    :label="currentStepLabel"
  />

  <main class="relative flex-1 flex flex-col items-center px-8 pt-14 pb-10">
    <SharedLoadingSpinner
      v-if="profileLoading || !pageReady"
      size="lg"
      :label="t('common.info.loading')"
    />
    <component
      :is="currentPage"
      v-else
    />

    <div
      v-if="isLoading"
      class="absolute inset-0 z-10 flex items-center justify-center bg-card/70 backdrop-blur-[1px]"
    >
      <SharedLoadingSpinner
        size="md"
        :label="t('onboard.action.finishing')"
      />
    </div>
  </main>

  <OnboardNav
    v-if="pageReady"
    :current-step="currentStep"
    :total-steps="totalSteps"
    :loading="isLoading"
    @next-page="bumpStep"
    @back-page="backStep"
  />
</template>
