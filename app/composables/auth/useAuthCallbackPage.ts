import { mapAuthErrorString } from '~/utils/authErrors'
import { completeAuthCallbackFromUrl } from '~/utils/supabaseAuthCallback'

export type AuthCallbackPageResult
  = | { ok: true }
    | { ok: false, message: string }

/** Shared init for `/auth/confirm` and `/auth/reset-password`. */
export function useAuthCallbackPage() {
  const { t, locale, loadLocaleMessages } = useI18n()
  const route = useRoute()
  const supabase = useSupabaseClient()

  async function resolveFromUrl(): Promise<AuthCallbackPageResult> {
    await loadLocaleMessages(locale.value)
    const result = await completeAuthCallbackFromUrl(supabase, route.query)
    if (result.ok) return { ok: true }
    return {
      ok: false,
      message: mapAuthErrorString(result.error, t, result.errorCode),
    }
  }

  return { resolveFromUrl }
}
