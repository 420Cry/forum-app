import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useSupabaseToken } from './useSupabaseToken'
import { useUserProfile } from '../user/useUserProfile'
import { clearOnboardSession } from '../onboard/useOnboard'
import {
  isDuplicateSignupUser,
  isEmailVerified,
  isSignupUserAlreadyExistsError,
} from '~/utils/authSession'
import {
  isValidAuthEmail,
  mapSupabaseAuthError,
  normalizeAuthEmail,
} from '~/utils/authErrors'

export interface AuthUser {
  id: string
  email: string | null
  emailVerified: boolean
}

export interface RegisterResult {
  needsVerification: boolean
}

function toAuthUser(u: SupabaseUser | null | undefined): AuthUser | null {
  if (!u) return null
  return {
    id: u.id,
    email: u.email ?? null,
    emailVerified: isEmailVerified(u),
  }
}

function getAppOrigin(): string {
  if (import.meta.client) {
    return window.location.origin
  }
  return useRequestURL().origin
}

export function useSupabaseAuth() {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()
  const refreshedUser = useState<SupabaseUser | null>(
    'supabase-refreshed-user',
    () => null,
  )
  const { getAccessToken } = useSupabaseToken()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const errorAction = ref<'forgot_password' | null>(null)

  function authCallbackUrl(path: string): string {
    return `${getAppOrigin()}${localePath(path)}`
  }

  function isSupabaseUser(u: unknown): u is SupabaseUser {
    return !!u && typeof u === 'object' && 'id' in u
  }

  const user = computed(() => {
    const current = refreshedUser.value ?? supabaseUser.value
    return isSupabaseUser(current) ? toAuthUser(current) : null
  })
  const isAuthenticated = computed(() => !!user.value)

  function rejectInvalidEmail(): boolean {
    error.value = t('auth.error.email_invalid_format')
    return false
  }

  function prepareEmail(raw: string): string | null {
    const email = normalizeAuthEmail(raw)
    if (!isValidAuthEmail(email)) {
      rejectInvalidEmail()
      return null
    }
    return email
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    const normalizedEmail = prepareEmail(email)
    if (!normalizedEmail) {
      loading.value = false
      return
    }
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      })
      if (err) {
        error.value = mapSupabaseAuthError(err, t)
        return
      }
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
        refreshedUser.value = data.session.user
      }
      else {
        await refreshUser()
      }
    }
    finally {
      loading.value = false
    }
  }

  function blockExistingEmailOnSignup(): undefined {
    errorAction.value = 'forgot_password'
    error.value = t('auth.error.user_already_exists')
    return undefined
  }

  async function register(
    email: string,
    password: string,
  ): Promise<RegisterResult | undefined> {
    loading.value = true
    error.value = null
    errorAction.value = null
    const normalizedEmail = prepareEmail(email)
    if (!normalizedEmail) {
      loading.value = false
      return undefined
    }
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: authCallbackUrl('/auth/confirm'),
        },
      })
      if (err) {
        if (isSignupUserAlreadyExistsError(err)) {
          return blockExistingEmailOnSignup()
        }
        error.value = mapSupabaseAuthError(err, t)
        return
      }

      if (isDuplicateSignupUser(data.user)) {
        return blockExistingEmailOnSignup()
      }

      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
        refreshedUser.value = data.session.user
        return { needsVerification: false }
      }

      refreshedUser.value = null
      return { needsVerification: !isEmailVerified(data.user) }
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    clearOnboardSession()
    useUserProfile().clearProfile()
    error.value = null
    refreshedUser.value = null
    await supabase.auth.signOut({ scope: 'local' })
  }

  async function resetPassword(email: string) {
    loading.value = true
    error.value = null
    const normalizedEmail = prepareEmail(email)
    if (!normalizedEmail) {
      loading.value = false
      return
    }
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: authCallbackUrl('/auth/reset-password'),
      })
      if (err) error.value = mapSupabaseAuthError(err, t)
    }
    finally {
      loading.value = false
    }
  }

  async function refreshUser(): Promise<boolean> {
    const { data: current } = await supabase.auth.getSession()
    if (!current.session) {
      return isEmailVerified(refreshedUser.value)
    }

    const { data, error } = await supabase.auth.refreshSession()
    if (error || !data.session) {
      const { data: userData } = await supabase.auth.getUser()
      refreshedUser.value = userData.user ?? current.session.user
      return isEmailVerified(refreshedUser.value)
    }

    const { data: userData } = await supabase.auth.getUser()
    refreshedUser.value = userData.user
    return isEmailVerified(userData.user)
  }

  function clearError() {
    error.value = null
    errorAction.value = null
  }

  return {
    user,
    loading,
    error,
    errorAction,
    clearError,
    isAuthenticated,
    login,
    register,
    logout,
    getAccessToken,
    resetPassword,
    refreshUser,
  }
}
