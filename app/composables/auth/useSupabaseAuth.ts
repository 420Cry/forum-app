import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useSupabaseToken } from './useSupabaseToken'
import { useUserProfile } from '../user/useUserProfile'

export interface AuthUser {
  id: string
  email: string | null
  emailVerified: boolean
}

function toAuthUser(u: SupabaseUser | null | undefined): AuthUser | null {
  if (!u) return null
  return {
    id: u.id,
    email: u.email ?? null,
    emailVerified: !!u.email_confirmed_at,
  }
}

function getAppOrigin(): string {
  if (import.meta.client) {
    return window.location.origin
  }
  return useRequestURL().origin
}

function isSupabaseUser(u: unknown): u is SupabaseUser {
  return !!u && typeof u === 'object' && 'id' in u
}

export function useSupabaseAuth() {
  const { t } = useI18n()
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()
  const refreshedUser = useState<SupabaseUser | null>(
    'supabase-refreshed-user',
    () => null,
  )
  const { getAccessToken } = useSupabaseToken()

  const loading = ref(false)
  const error = ref<string | null>(null)

  const user = computed(() => {
    const current = refreshedUser.value ?? supabaseUser.value
    return isSupabaseUser(current) ? toAuthUser(current) : null
  })
  const isAuthenticated = computed(() => !!user.value)

  if (import.meta.client) {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible'
        && user.value
        && !user.value.emailVerified
      ) {
        void refreshUser()
      }
    }
    onMounted(() =>
      document.addEventListener('visibilitychange', handleVisibilityChange),
    )
    onUnmounted(() =>
      document.removeEventListener('visibilitychange', handleVisibilityChange),
    )
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (err) {
        error.value
          = err.code === 'email_not_confirmed'
            ? t('auth.error.email_not_verified')
            : err.message
        return
      }
      await refreshUser()
    }
    finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${getAppOrigin()}/auth/confirm`,
        },
      })
      if (err) {
        error.value = err.message
        return
      }
      refreshedUser.value = data.user
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    useUserProfile().clearProfile()
    error.value = null
    refreshedUser.value = null
    await supabase.auth.signOut()
  }

  async function resetPassword(email: string) {
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getAppOrigin()}/auth/reset-password`,
      })
      if (err) error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  async function refreshUser(): Promise<boolean> {
    await supabase.auth.refreshSession()
    const { data } = await supabase.auth.getUser()
    refreshedUser.value = data.user
    return !!data.user?.email_confirmed_at
  }

  async function resendVerificationEmail() {
    if (!user.value?.email) {
      error.value = t('auth.error.not_signed_in')
      return
    }
    if (user.value.emailVerified) {
      error.value = t('auth.error.email_already_verified')
      return
    }
    loading.value = true
    error.value = null
    try {
      const { error: err } = await supabase.auth.resend({
        type: 'signup',
        email: user.value.email,
        options: {
          emailRedirectTo: `${getAppOrigin()}/auth/confirm`,
        },
      })
      if (err) error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    clearError,
    isAuthenticated,
    login,
    register,
    logout,
    getAccessToken,
    resetPassword,
    refreshUser,
    resendVerificationEmail,
  }
}
