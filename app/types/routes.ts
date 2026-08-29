/**
 * Access level a page declares via `definePageMeta({ access: ... })`.
 *
 * - `public`    — anyone; middleware never redirects (default when omitted)
 * - `guest`     — only for signed-out users; verified users go to /social
 * - `entry`     — app root; session-aware redirect to login / onboard / social
 * - `callback`  — auth email-link landing pages; never redirected
 * - `protected` — requires a verified session; gated by onboarding state
 */
export type RouteAccess = 'public' | 'guest' | 'entry' | 'callback' | 'protected'

declare module '#app' {
  interface PageMeta {
    access?: RouteAccess
  }
}
