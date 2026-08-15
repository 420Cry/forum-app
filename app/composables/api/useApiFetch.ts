import { isFetchUnauthorized } from '~/utils/authSession'
import { useSupabaseToken } from '../auth/useSupabaseToken'

type HttpMethod
  = | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'DELETE'
    | 'CONNECT' | 'OPTIONS' | 'TRACE'
    | 'get' | 'head' | 'patch' | 'post' | 'put' | 'delete'
    | 'connect' | 'options' | 'trace'

export type ApiFetchOptions = {
  method?: HttpMethod
  body?: unknown
  query?: Record<string, unknown>
  headers?: Record<string, string>
  credentials?: RequestCredentials
  timeout?: number
  /** Set false for endpoints that serve signed-out visitors. */
  requireAuth?: boolean
}

/**
 * Single entry point for forum-api calls: attaches the Supabase bearer token
 * and retries once with a refreshed JWT on 401, so a token that expired while
 * the tab was idle does not surface as a failed request.
 */
export function useApiFetch() {
  const config = useRuntimeConfig()
  const baseUrl = config.public.forumApiUrl
  const { getAccessToken } = useSupabaseToken()

  async function apiFetch<T>(
    path: string,
    options: ApiFetchOptions = {},
  ): Promise<T> {
    const requireAuth = options.requireAuth ?? true
    const token = await getAccessToken()

    if (requireAuth && !token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Missing access token',
      })
    }

    const { requireAuth: _requireAuth, headers, ...rest } = options
    const url = `${baseUrl}${path}`

    const run = (authToken: string | null) =>
      $fetch(url, {
        ...rest,
        headers: authToken
          ? { ...headers, Authorization: `Bearer ${authToken}` }
          : headers,
      // Nitro's body type rejects concrete interfaces; callers pass typed JSON.
      } as Parameters<typeof $fetch>[1]) as Promise<T>

    try {
      return await run(token)
    }
    catch (err) {
      if (!requireAuth || !isFetchUnauthorized(err)) throw err

      const refreshed = await getAccessToken(true)
      if (!refreshed || refreshed === token) throw err

      return await run(refreshed)
    }
  }

  return { apiFetch }
}
