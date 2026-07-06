/**
 * Access level a page declares via `definePageMeta({ access: ... })`.
 *
 * - `public`    — anyone; middleware never redirects (default when omitted)
 * - `guest`     — only for signed-out users; verified users go to /home
 * - `callback`  — auth email-link landing pages; never redirected
 * - `protected` — requires a verified session; gated by onboarding state
 */
export type RouteAccess = 'public' | 'guest' | 'callback' | 'protected'

declare module '#app' {
  interface PageMeta {
    access?: RouteAccess
  }
}
