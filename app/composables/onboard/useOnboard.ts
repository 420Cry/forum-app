import { shallowRef, ref, computed, reactive, readonly, watch } from 'vue'
import BasicInfo from '@/components/onboard/BasicInfo.vue'
import GoalSelection from '@/components/onboard/GoalSelection.vue'
import RoleSelection from '@/components/onboard/RoleSelection.vue'
import type { goalKeyType, roleTitlesType } from '~/types/onboard/onboardType'
import { buildOnboardDraftPayload } from '~/utils/onboardDraft'
import { useZodValidation } from '../validate/useZodValidation'
import { createOnboardInfoSchema } from '~/types/onboard/schema/onboardInfoSchema'
import { useOnboardApi } from '../api/onboard/useOnboardApi'
import type { ApiErrResponse } from '~/types/api'
import type { UserProfile } from '~/types/user'
import { inferOnboardingStep, isOnboardingComplete } from '~/types/user'
import { isFetchUnauthorized } from '~/utils/authSession'
import { useUserProfile } from '../user/useUserProfile'
import { useCatalogApi } from '../api/useCatalogApi'

type onboardInfoType = {
  role: '' | roleTitlesType
  goals: goalKeyType[]
  firstName: string
  lastName: string
  dateOfBirth: string
  location: string
  locationName: string
  occupation: string
  occupationName: string
  avatarUrl: string | null
}

function emptyOnboardInfo(): onboardInfoType {
  return {
    role: '',
    goals: [],
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    location: '',
    locationName: '',
    occupation: '',
    occupationName: '',
    avatarUrl: null,
  }
}

// Shared across the onboarding SPA session. Draft fields sync to the server
// debounced; completion still requires the final POST /user/onboarding.
const onboardInfo = reactive<onboardInfoType>(emptyOnboardInfo())

const stepLabelKeys: Record<number, string> = {
  1: 'onboard.heading.choose_role',
  3: 'onboard.heading.about_yourself',
}

const infoErrors = ref<Record<string, string> | null>(null)
const goalsRole = ref<'' | roleTitlesType>('')
const currentStep = ref(1)
const isLoading = ref(false)
const draftSyncEnabled = ref(false)
let draftTimer: ReturnType<typeof setTimeout> | undefined
let sessionActive = false
/** Supabase user id that owns the in-memory wizard draft (if any). */
let sessionOwnerId: string | null = null
/** Skip the deep watch while we navigate steps (avoids double PATCH). */
let suppressDraftWatch = false

async function persistDraft() {
  if (!draftSyncEnabled.value || isLoading.value) return

  try {
    const { saveOnboardingDraft } = useOnboardApi()
    const payload = buildOnboardDraftPayload({
      step: currentStep.value,
      role: onboardInfo.role,
      goals: onboardInfo.goals,
      firstName: onboardInfo.firstName,
      lastName: onboardInfo.lastName,
      dateOfBirth: onboardInfo.dateOfBirth,
      location: onboardInfo.location,
      locationName: onboardInfo.locationName,
      occupation: onboardInfo.occupation,
      occupationName: onboardInfo.occupationName,
      avatarUrl: onboardInfo.avatarUrl,
    })
    await saveOnboardingDraft(payload)
  }
  catch {
    // Background save — final submit still validates and surfaces errors.
  }
}

function scheduleDraftSave() {
  if (!import.meta.client || !draftSyncEnabled.value || isLoading.value) return
  clearTimeout(draftTimer)
  draftTimer = setTimeout(() => {
    void persistDraft()
  }, 800)
}

function enableDraftSync() {
  draftSyncEnabled.value = true
}

function disableDraftSync() {
  draftSyncEnabled.value = false
  clearTimeout(draftTimer)
  draftTimer = undefined
}

/**
 * Clear module-level wizard state without Nuxt inject context.
 * Safe to call from logout / auth handlers outside component setup.
 */
export function clearOnboardSession() {
  disableDraftSync()
  sessionActive = false
  sessionOwnerId = null
  Object.assign(onboardInfo, emptyOnboardInfo())
  infoErrors.value = null
  goalsRole.value = ''
  currentStep.value = 1
}

/** Flush any pending debounced draft, then optionally keep sync enabled. */
async function flushDraft() {
  if (!import.meta.client || isLoading.value) return
  clearTimeout(draftTimer)
  draftTimer = undefined
  if (!draftSyncEnabled.value) return
  await persistDraft()
}

if (import.meta.client) {
  watch(
    [onboardInfo, currentStep],
    () => {
      if (suppressDraftWatch) return
      scheduleDraftSave()
    },
    { deep: true },
  )
}

export const useOnboard = () => {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const onboardPage = shallowRef([
    { step: 1, pageName: RoleSelection, active: false },
    { step: 2, pageName: GoalSelection, active: false },
    { step: 3, pageName: BasicInfo, active: false },
  ])

  const totalSteps = onboardPage.value.length

  const currentPage = computed(() => {
    const selectedPage = onboardPage.value.find(page => page.active === true)
    return selectedPage?.pageName
  })

  const currentStepLabel = computed(() => {
    if (currentStep.value === 2) {
      return onboardInfo.role === 'Investor'
        ? t('onboard.heading.investor_goals')
        : t('onboard.heading.founder_goals')
    }
    const key = stepLabelKeys[currentStep.value]
    return key ? t(key) : ''
  })

  const updateOnboardPage = () => {
    onboardPage.value = onboardPage.value.map(onboardStep => ({
      ...onboardStep,
      active: onboardStep.step === currentStep.value,
    }))
  }

  const toast = useToast()
  const { refreshProfile } = useUserProfile()
  const { clearCatalogCache } = useCatalogApi()

  const resetOnboarding = () => {
    clearOnboardSession()
    updateOnboardPage()
  }

  // Prefill from an existing profile (edit flow / already-collected data).
  const hydrateFromProfile = (
    profile: UserProfile | null,
    ownerId: string | null = null,
  ) => {
    if (!profile) return

    if (profile.role) onboardInfo.role = profile.role
    if (profile.goals.length > 0) {
      onboardInfo.goals = profile.goals as goalKeyType[]
      goalsRole.value = profile.role ?? ''
    }
    if (profile.name) {
      const [firstName, ...rest] = profile.name.trim().split(/\s+/)
      onboardInfo.firstName = firstName ?? ''
      onboardInfo.lastName = rest.join(' ')
    }
    if (profile.dateOfBirth) onboardInfo.dateOfBirth = profile.dateOfBirth
    if (profile.location) onboardInfo.location = profile.location
    if (profile.occupation) onboardInfo.occupation = profile.occupation
    if (profile.avatarUrl) onboardInfo.avatarUrl = profile.avatarUrl

    currentStep.value = inferOnboardingStep(profile)
    sessionActive = true
    sessionOwnerId = ownerId
  }

  /** Keep wizard progress when the page remounts (e.g. locale switch). */
  const restoreOnboardSession = (
    profile: UserProfile | null,
    ownerId: string | null = null,
  ): boolean => {
    if (
      sessionActive
      && ownerId
      && sessionOwnerId
      && ownerId !== sessionOwnerId
    ) {
      clearOnboardSession()
      return false
    }

    if (!sessionActive) return false
    if (isOnboardingComplete(profile)) return false
    updateOnboardPage()
    return true
  }

  const showApiError = (err: unknown) => {
    const error = (err as { data?: ApiErrResponse })?.data
    if (!error) return toast.showError(t('common.error.try_again'), 2000)
    if (typeof error.message === 'string') {
      return toast.showError(error.message, 2000)
    }
    if (Array.isArray(error.message)) {
      error.message.forEach(msg => toast.showError(msg, 1500))
    }
  }

  async function submitOnboarding() {
    const { formInputValidate } = useZodValidation()
    const { role, goals, ...info } = onboardInfo

    const { data, errors } = formInputValidate(
      info,
      createOnboardInfoSchema(t),
    )
    if (errors) {
      infoErrors.value = errors
      return false
    }
    infoErrors.value = null

    isLoading.value = true
    disableDraftSync()
    try {
      const { saveOnboarding, updateProfile } = useOnboardApi()
      const res = await saveOnboarding({
        role: role as roleTitlesType,
        goals,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        location: data.location,
        locationName: onboardInfo.locationName || undefined,
        occupation: data.occupation,
        occupationName: onboardInfo.occupationName || undefined,
      })
      if (!res.success) {
        toast.showError(t('common.error.try_again_later'), 1500)
        return false
      }
      if (onboardInfo.avatarUrl) {
        try {
          await updateProfile({ avatarUrl: onboardInfo.avatarUrl })
        }
        catch {
          // Profile was created; avatar can be set later from settings.
        }
      }
      await refreshProfile(true)
      resetOnboarding()
      clearCatalogCache()
      await navigateTo(localePath('/social'), { replace: true })
      return true
    }
    catch (err: unknown) {
      if (isFetchUnauthorized(err)) {
        toast.showError(t('auth.error.session_invalid'), 4000)
        await navigateTo(localePath('/auth/login'))
        return false
      }
      showApiError(err)
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  // Local-only navigation with per-step validation. Draft syncs debounced
  // to the server; the final step submits the whole payload.
  const bumpStep = async () => {
    if (currentStep.value === 1) {
      if (!onboardInfo.role) {
        return toast.showError(t('onboard.error.select_role'), 3000)
      }
    }

    if (currentStep.value === 2) {
      if (onboardInfo.goals.length === 0) {
        return toast.showError(t('onboard.error.select_goal'), 3000)
      }
    }

    if (currentStep.value === totalSteps) {
      await submitOnboarding()
      return
    }

    // Advance UI immediately; one non-blocking flush with the new step.
    // (Awaiting flush here made Next feel slow and doubled with the watch.)
    suppressDraftWatch = true
    currentStep.value++
    updateOnboardPage()
    suppressDraftWatch = false
    void flushDraft()
  }

  const clearInfoError = (field: string) => {
    if (!infoErrors.value) return
    const { [field]: _, ...rest } = infoErrors.value
    infoErrors.value = Object.keys(rest).length > 0 ? rest : null
  }

  const backStep = () => {
    if (currentStep.value === 1) return
    suppressDraftWatch = true
    currentStep.value--
    updateOnboardPage()
    suppressDraftWatch = false
    void flushDraft()
  }

  // Do NOT register onUnmounted here — RoleSelection / GoalSelection / BasicInfo
  // also call useOnboard(), and their unmount on step change was disabling draft
  // sync and cancelling pending saves. Page owns lifecycle cleanup.

  return {
    currentPage,
    currentStep,
    currentStepLabel,
    onboardPage,
    totalSteps,
    bumpStep,
    backStep,
    updateOnboardPage,
    hydrateFromProfile,
    restoreOnboardSession,
    resetOnboarding,
    enableDraftSync,
    disableDraftSync,
    flushDraft,
    onboardInfo,
    goalsRole,
    isLoading,
    infoErrors: readonly(infoErrors),
    clearInfoError,
  }
}
