import type { SupabaseClient } from '@supabase/supabase-js'
import {
  isEmailOtpType,
  mergeAuthCallbackParams,
  stripAuthParamsFromUrl,
} from '~/utils/authCallbackParams'

export type AuthCallbackResult
  = | { ok: true }
    | { ok: false, error?: string, errorCode?: string }

export {
  getAuthCallbackQuery,
  isEmailOtpType,
  mergeAuthCallbackParams,
  parseHashAuthParams,
  stripAuthParamsFromUrl,
} from '~/utils/authCallbackParams'

type AuthErrorLike = { message?: string, code?: string }

function authFail(
  error?: AuthErrorLike,
  fallbackCode?: string,
): Extract<AuthCallbackResult, { ok: false }> {
  return {
    ok: false,
    error: error?.message,
    errorCode: error?.code ?? fallbackCode,
  }
}

export async function waitForAuthSession(
  supabase: SupabaseClient,
  timeoutMs = 5000,
): Promise<boolean> {
  const { data } = await supabase.auth.getSession()
  if (data.session) return true

  return new Promise((resolve) => {
    let done = false
    const finish = (value: boolean) => {
      if (done) return
      done = true
      clearTimeout(timer)
      listener.subscription.unsubscribe()
      resolve(value)
    }

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          session
          && (
            event === 'SIGNED_IN'
            || event === 'INITIAL_SESSION'
            || event === 'TOKEN_REFRESHED'
            || event === 'PASSWORD_RECOVERY'
          )
        ) {
          finish(true)
        }
      },
    )

    const timer = setTimeout(async () => {
      const { data: latest } = await supabase.auth.getSession()
      finish(!!latest.session)
    }, timeoutMs)
  })
}

async function persistSession(
  supabase: SupabaseClient,
  session: { access_token: string, refresh_token: string } | null,
) {
  if (!session) return
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  })
}

async function hasPkceCodeVerifier(supabase: SupabaseClient): Promise<boolean> {
  const auth = supabase.auth as unknown as {
    storageKey: string
    storage: { getItem: (key: string) => Promise<string | null> }
  }

  try {
    const verifier = await auth.storage.getItem(
      `${auth.storageKey}-code-verifier`,
    )
    return !!verifier
  }
  catch {
    return false
  }
}

export async function completeAuthCallbackFromUrl(
  supabase: SupabaseClient,
  query: Record<string, unknown>,
): Promise<AuthCallbackResult> {
  // Prefer live window hash when present (works in Vitest stubs too).
  const hash
    = typeof window !== 'undefined' && window.location?.hash
      ? window.location.hash
      : ''
  const params = mergeAuthCallbackParams(query, hash)

  if (params.urlError || params.errorCode) {
    return { ok: false, error: params.urlError, errorCode: params.errorCode }
  }

  if (params.tokenHash && params.type && isEmailOtpType(params.type)) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: params.tokenHash,
      type: params.type,
    })
    if (error) return authFail(error)
    await persistSession(supabase, data.session)
    stripAuthParamsFromUrl()
    return { ok: true }
  }

  // Reject implicit hash bearer tokens immediately (do not wait for a session).
  if (params.accessToken || params.refreshToken) {
    stripAuthParamsFromUrl()
    return authFail(undefined, 'implicit_flow_disabled')
  }

  if (params.code && await hasPkceCodeVerifier(supabase)) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code)
    if (error) return authFail(error)
    await persistSession(supabase, data.session)
    stripAuthParamsFromUrl()
    return { ok: true }
  }

  const hasSession = await waitForAuthSession(supabase)
  if (hasSession) {
    stripAuthParamsFromUrl()
    return { ok: true }
  }

  if (params.code) return authFail(undefined, 'flow_state_not_found')

  return { ok: false }
}
