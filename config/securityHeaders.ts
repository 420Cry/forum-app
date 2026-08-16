/**
 * Security response headers applied to every route via Nuxt `routeRules`.
 *
 * Header values are baked at build time, so every relaxation is opt-in on an
 * explicit `NODE_ENV=development`: an unset NODE_ENV must never produce a
 * dev-grade policy in a production build.
 */

export type SecurityHeaderOptions = {
  /** Origins the browser is allowed to call (Forum API, Supabase, …). */
  apiOrigins: string[]
  /** Local stack only: nginx aliases and Vite HMR are plain http:// / ws://. */
  dev: boolean
}

/**
 * `connect-src`. Sendbird endpoints are app-id scoped and only known at runtime
 * (the id ships in the chat session), so blanket `https:`/`wss:` stays for now.
 */
export function connectSrcDirective(options: SecurityHeaderOptions): string {
  const origins = new Set(['\'self\'', 'https:', 'wss:'])
  if (options.dev) {
    origins.add('http:')
    origins.add('ws:')
  }
  for (const raw of options.apiOrigins) {
    let url: URL
    try {
      url = new URL(raw)
    }
    catch {
      continue
    }
    origins.add(url.origin)
    if (url.protocol === 'https:') origins.add(`wss://${url.host}`)
    if (url.protocol === 'http:') origins.add(`ws://${url.host}`)
  }
  return ['connect-src', ...origins].join(' ')
}

export function contentSecurityPolicy(options: SecurityHeaderOptions): string {
  return [
    'default-src \'self\'',
    'base-uri \'self\'',
    'form-action \'self\'',
    'frame-ancestors \'none\'',
    'object-src \'none\'',
    'img-src \'self\' data: blob: https:',
    'media-src \'self\' blob: https:',
    'font-src \'self\' data:',
    'style-src \'self\' \'unsafe-inline\'',
    // TODO: drop 'unsafe-inline'/'unsafe-eval' once Nuxt payloads are nonced.
    'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'',
    connectSrcDirective(options),
    'worker-src \'self\' blob:',
  ].join('; ')
}

export function securityHeaders(
  options: SecurityHeaderOptions,
): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': contentSecurityPolicy(options),
  }
}
