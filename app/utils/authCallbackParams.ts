import type { EmailOtpType } from '@supabase/supabase-js'

const EMAIL_OTP_TYPES = new Set<string>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
])

const AUTH_QUERY_PARAM_KEYS = [
  'token_hash',
  'type',
  'code',
  'error',
  'error_description',
  'error_code',
] as const

export type AuthCallbackParams = {
  tokenHash?: string
  type?: string
  code?: string
  errorCode?: string
  urlError?: string
  accessToken?: string
  refreshToken?: string
}

function queryString(
  query: Record<string, unknown>,
  key: string,
): string | undefined {
  return typeof query[key] === 'string' ? query[key] : undefined
}

export function isEmailOtpType(type: string): type is EmailOtpType {
  return EMAIL_OTP_TYPES.has(type)
}

export function getAuthCallbackQuery(
  query: Record<string, unknown>,
): AuthCallbackParams {
  return {
    tokenHash: queryString(query, 'token_hash'),
    type: queryString(query, 'type'),
    code: queryString(query, 'code'),
    errorCode: queryString(query, 'error_code'),
    urlError:
      queryString(query, 'error_description')
      ?? queryString(query, 'error'),
  }
}

export function parseHashAuthParams(hash: string): AuthCallbackParams {
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
): AuthCallbackParams {
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

export function stripAuthParamsFromUrl() {
  if (!import.meta.client) return

  const url = new URL(window.location.href)
  for (const key of AUTH_QUERY_PARAM_KEYS) {
    url.searchParams.delete(key)
  }
  url.hash = ''
  const next = `${url.pathname}${url.search}`
  window.history.replaceState(window.history.state, '', next)
}
