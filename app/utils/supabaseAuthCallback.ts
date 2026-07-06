import type { EmailOtpType, SupabaseClient } from '@supabase/supabase-js'

const EMAIL_OTP_TYPES = new Set<string>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
])

export function isEmailOtpType(type: string): type is EmailOtpType {
  return EMAIL_OTP_TYPES.has(type)
}

export function getAuthCallbackQuery(query: Record<string, unknown>) {
  const tokenHash
    = typeof query.token_hash === 'string' ? query.token_hash : undefined
  const type = typeof query.type === 'string' ? query.type : undefined
  const code = typeof query.code === 'string' ? query.code : undefined
  const errorCode
    = typeof query.error_code === 'string' ? query.error_code : undefined
  const urlError
    = typeof query.error_description === 'string'
      ? query.error_description
      : typeof query.error === 'string'
        ? query.error
        : undefined

  return { tokenHash, type, code, errorCode, urlError }
}

export function parseHashAuthParams(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return {
    tokenHash: params.get('token_hash') ?? undefined,
    type: params.get('type') ?? undefined,
    code: params.get('code') ?? undefined,
    errorCode: params.get('error_code') ?? undefined,
    urlError:
      params.get('error_description')
      ?? params.get('error')
      ?? undefined,
    accessToken: params.get('access_token') ?? undefined,
    refreshToken: params.get('refresh_token') ?? undefined,
  }
}

export function mergeAuthCallbackParams(
  query: Record<string, unknown>,
  hash = '',
) {
  const fromQuery = getAuthCallbackQuery(query)
  const fromHash = parseHashAuthParams(hash)

  return {
    tokenHash: fromQuery.tokenHash ?? fromHash.tokenHash,
    type: fromQuery.type ?? fromHash.type,
    code: fromQuery.code ?? fromHash.code,
    errorCode: fromQuery.errorCode ?? fromHash.errorCode,
    urlError: fromQuery.urlError ?? fromHash.urlError,
    accessToken: fromHash.accessToken,
    refreshToken: fromHash.refreshToken,
  }
}

export type AuthCallbackResult
  = | { ok: true }
    | { ok: false, error?: string, errorCode?: string }

export function stripAuthParamsFromUrl() {
  if (!import.meta.client) return

  const url = new URL(window.location.href)
  for (const key of [
    'token_hash',
    'type',
    'code',
    'error',
    'error_description',
    'error_code',
  ]) {
    url.searchParams.delete(key)
  }
  url.hash = ''
  const next = `${url.pathname}${url.search}`
  window.history.replaceState(window.history.state, '', next)
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
  const hash = import.meta.client ? window.location.hash : ''
  const {
    tokenHash,
    type,
    code,
    errorCode,
    urlError,
    accessToken,
    refreshToken,
  } = mergeAuthCallbackParams(query, hash)

  if (urlError || errorCode) {
    return { ok: false, error: urlError, errorCode }
  }

  if (tokenHash && type && isEmailOtpType(type)) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })
    if (error) {
      return {
        ok: false,
        error: error.message,
        errorCode: error.code,
      }
    }
    await persistSession(supabase, data.session)
    stripAuthParamsFromUrl()
    return { ok: true }
  }

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (error) {
      return {
        ok: false,
        error: error.message,
        errorCode: error.code,
      }
    }
    stripAuthParamsFromUrl()
    return { ok: true }
  }

  if (code && await hasPkceCodeVerifier(supabase)) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return {
        ok: false,
        error: error.message,
        errorCode: error.code,
      }
    }
    await persistSession(supabase, data.session)
    stripAuthParamsFromUrl()
    return { ok: true }
  }

  const hasSession = await waitForAuthSession(supabase)
  if (hasSession) {
    stripAuthParamsFromUrl()
    return { ok: true }
  }

  if (code) {
    return {
      ok: false,
      errorCode: 'flow_state_not_found',
    }
  }

  return { ok: false }
}
