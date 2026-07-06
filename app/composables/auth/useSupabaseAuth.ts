import type { User as SupabaseUser } from '@supabase/supabase-js'
import { useSupabaseToken } from './useSupabaseToken'
import { useUserProfile } from '../user/useUserProfile'

export interface AuthUser {
  id: string
  email: string | null
}

function toAuthUser(u: SupabaseUser | null | undefined): AuthUser | null {
  if (!u) return null
  return {
    id: u.id,
    email: u.email ?? null,
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

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (err) {
        error.value = err.message
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
        error.value
          = err.code === 'user_already_exists'
            ? t('auth.error.user_already_exists')
            : err.message
        return
      }

      refreshedUser.value = data.user

      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        })
        refreshedUser.value = data.session.user
      }
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
    const { data: current } = await supabase.auth.getSession()
    if (!current.session) return false

    const { data, error } = await supabase.auth.refreshSession()
    if (error || !data.session) {
      refreshedUser.value = current.session.user
      return true
    }

    const { data: userData } = await supabase.auth.getUser()
    refreshedUser.value = userData.user
    return true
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
  }
}
