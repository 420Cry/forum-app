import { shallowRef, ref, computed, reactive, readonly } from 'vue'
import BasicInfo from '@/components/onboard/BasicInfo.vue'
import GoalSelection from '@/components/onboard/GoalSelection.vue'
import RoleSelection from '@/components/onboard/RoleSelection.vue'
import type {
  goalTitlesType,
  roleTitlesType,
} from '~/types/onboard/onboardType'
import { useZodValidation } from '../validate/useZodValidation'
import { createOnboardInfoSchema } from '~/types/onboard/schema/onboardInfoSchema'
import { useOnboardApi } from '../api/onboard/useOnboardApi'
import { createRolePayloadSchema } from '~/types/onboard/schema/rolePayloadSchema'
import type { ApiErrResponse } from '~/types/api'
import type { UserProfile } from '~/types/user'
import { onboardStepFromProcess } from '~/types/user'
import { isFetchUnauthorized } from '~/utils/authSession'
import { useUserProfile } from '../user/useUserProfile'

type onboardInfoType = {
  role: '' | roleTitlesType
  goals: goalTitlesType[]
  firstName: string
  lastName: string
  age: string
  location: string
  occupation: string
}

const onboardInfo = reactive<onboardInfoType>({
  role: '',
  goals: [],
  firstName: '',
  lastName: '',
  age: '',
  location: '',
  occupation: '',
})

const stepLabelKeys: Record<number, string> = {
  1: 'onboard.heading.choose_role',
  3: 'onboard.heading.about_yourself',
}

const infoErrors = ref<Record<string, string> | null>(null)

const goalsRole = ref<'' | roleTitlesType>('')

export const useOnboard = () => {
  const { t } = useI18n()
  const onboardPage = shallowRef([
    { step: 1, pageName: RoleSelection, active: false },
    { step: 2, pageName: GoalSelection, active: false },
    { step: 3, pageName: BasicInfo, active: false },
  ])

  const currentStep = ref(1)
  const isLoading = ref(false)

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

  async function handleUnauthorized(err: unknown) {
    if (!isFetchUnauthorized(err)) return false
    toast.showError(t('auth.error.session_invalid'), 4000)
    await navigateTo('/auth/login')
    return true
  }

  const hydrateFromProfile = (profile: UserProfile | null) => {
    if (!profile || profile.onboard_process === 'Completed') return

    if (profile.role) onboardInfo.role = profile.role
    if (profile.goals.length > 0) {
      onboardInfo.goals = profile.goals as goalTitlesType[]
    }
    if (profile.name) {
      const [firstName, ...rest] = profile.name.trim().split(/\s+/)
      onboardInfo.firstName = firstName ?? ''
      onboardInfo.lastName = rest.join(' ')
    }
    if (profile.age != null) onboardInfo.age = String(profile.age)
    if (profile.location) onboardInfo.location = profile.location
    if (profile.occupation) onboardInfo.occupation = profile.occupation

    currentStep.value = onboardStepFromProcess(profile.onboard_process)
    updateOnboardPage()
  }

  const bumpStep = async () => {
    const { formInputValidate } = useZodValidation()
    if (currentStep.value === onboardPage.value.length) {
      isLoading.value = true
      const { saveUserInfo } = useOnboardApi()
      const submitInput = computed(() => {
        const { role, goals, ...rest } = onboardInfo
        return rest
      })
      try {
        const { data, errors } = formInputValidate(
          submitInput.value,
          createOnboardInfoSchema(t),
        )
        if (errors) {
          infoErrors.value = errors
          return
        }
        infoErrors.value = null
        const res = await saveUserInfo(data)
        if (!res.success) {
          return toast.showError(t('common.error.try_again_later'), 1500)
        }
        toast.showSuccess(res.message, 2000)
        await refreshProfile(true)
        return await navigateTo('/home')
      }
      catch (err: unknown) {
        if (await handleUnauthorized(err)) return
        const error = (err as { data?: ApiErrResponse })?.data
        if (!error) return toast.showError(t('common.error.try_again'), 2000)

        if (typeof error.message === 'string') {
          return toast.showError(error.message, 2000)
        }

        if (Array.isArray(error.message)) {
          error.message.forEach((msg) => {
            toast.showError(msg, 1500)
          })
          return
        }
      }
      finally {
        isLoading.value = false
      }
      return
    }

    if (currentStep.value === 1) {
      isLoading.value = true
      const { saveUserRole } = useOnboardApi()
      if (!onboardInfo.role) {
        isLoading.value = false
        return toast.showError(
          t('onboard.error.select_role'),
          3000,
        )
      }
      try {
        const { data, errors } = formInputValidate(
          { role: onboardInfo.role },
          createRolePayloadSchema(t),
        )
        if (errors) {
          return toast.showError(Object.values(errors)[0] as string, 3000)
        }

        const res = await saveUserRole(data)
        toast.showSuccess(res.message, 1500)
        await refreshProfile(true)
      }
      catch (err: unknown) {
        if (await handleUnauthorized(err)) return
        const error = (err as { data?: ApiErrResponse })?.data
        if (!error) return toast.showError(t('common.error.try_again'), 2000)

        if (typeof error.message === 'string') {
          return toast.showError(error.message, 2000)
        }

        if (Array.isArray(error.message)) {
          error.message.forEach((msg) => {
            toast.showError(msg, 1500)
          })
          return
        }
      }
      finally {
        isLoading.value = false
      }
    }

    if (currentStep.value === 2) {
      isLoading.value = true
      if (onboardInfo.goals.length === 0) {
        isLoading.value = false
        return toast.showError(
          t('onboard.error.select_goal'),
          3000,
        )
      }
      const { saveUserGoals } = useOnboardApi()
      try {
        const res = await saveUserGoals(onboardInfo.goals)
        toast.showSuccess(res.message, 1500)
        await refreshProfile(true)
      }
      catch (err: unknown) {
        if (await handleUnauthorized(err)) return
        const error = (err as { data?: ApiErrResponse })?.data
        if (!error) return toast.showError(t('common.error.try_again'), 2000)

        if (typeof error.message === 'string') {
          return toast.showError(error.message, 2000)
        }

        if (Array.isArray(error.message)) {
          error.message.forEach((msg) => {
            toast.showError(msg, 1500)
          })
        }
        return
      }
      finally {
        isLoading.value = false
      }
    }

    currentStep.value++
    updateOnboardPage()
  }

  const clearInfoError = (field: string) => {
    if (!infoErrors.value) return
    const { [field]: _, ...rest } = infoErrors.value
    infoErrors.value = Object.keys(rest).length > 0 ? rest : null
  }

  const backStep = () => {
    if (currentStep.value === 1) return
    currentStep.value--
    updateOnboardPage()
  }

  return {
    currentPage,
    currentStep,
    currentStepLabel,
    onboardPage,
    bumpStep,
    backStep,
    updateOnboardPage,
    hydrateFromProfile,
    onboardInfo,
    goalsRole,
    isLoading,
    infoErrors: readonly(infoErrors),
    clearInfoError,
  }
}
