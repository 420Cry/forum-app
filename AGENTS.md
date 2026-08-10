# AGENTS.md

Fundedr frontend — Nuxt 4 SPA for the forum project. Auth via Supabase; business data from **forum-api**.

Read [../ARCHITECTURE.md](../ARCHITECTURE.md) for the cross-repo system map.

## Run

- Package manager: **Bun 1.2+** (`packageManager` in `package.json`)
- Node: **22+** (`engines.node`)
- Install: `bun install`
- Env: copy `.env.example` → `.env` and `.env.local.example` → `.env.local`
- Dev (recommended): `forum dev` from [forum-server](../forum-server) → http://app.forum.test
- App only: `bun run dev` (no proxy)

## Verify (run before claiming "done")

```bash
bun run lint           # must exit 0
bun run test           # vitest --run; must exit 0
bun run test:coverage  # optional locally; CI runs this on every PR
```

From the monorepo dev-server: `forum test:unit` (api + app), `forum test:e2e` (full Playwright stack), `forum test` (both).

**Definition of done:** lint green, tests green, change manually verified on http://app.forum.test for at least one flow affected by the change.

## CI (GitHub Actions)

Workflow: `.github/workflows/ci.yml` on every push/PR to `main`.

| Job | What it runs |
| --- | --- |
| **verify** | `lint`, `test:coverage` (Vitest + v8), unit coverage artifact + job summary |
| **docker** | `Dockerfile` build (after verify) |
| **e2e** | Full stack (Supabase + Docker) + Playwright from `forum-test-automation`; e2e scenario summary in job output |

E2e checks out **forum-app at the PR/push branch**. Sibling repos (`forum-api`, `forum-test-automation`, `forum-server`) use the **same branch name when it exists**, otherwise fall back to `main` (see `.github/scripts/resolve-sibling-ref.sh`). Stack boot lives in `.github/scripts/ci-e2e.sh`.

Example: app / api / test-automation all on `4FOR-56` → e2e runs that trio together. If only app has `4FOR-56`, api and e2e stay on `main`.

Sibling checkouts need repo (or org) secret **`FORUM_CI_PAT`**: a classic or fine-grained PAT with `contents: read` on `420Cry/forum-api`, `420Cry/forum-test-automation`, and `420Cry/forum-server`. The default `GITHUB_TOKEN` cannot read private sibling repos (GitHub reports them as “not found”).

## Hard constraints

- **Never commit** `.env`, `.env.local`, or any file containing Supabase keys/tokens.
- **Never run without explicit confirmation:** production deploys, `phrase push`, destructive DB commands.
- **Don't reformat** files unrelated to your change.
- **Don't auto-bump dependencies** as part of an unrelated change.

## Domain vocabulary

- **Fundedr** — product name shown in the UI.
- **Onboarding** — three-step wizard (`/onboard`); completion = `profile.onboarded === true` from `/auth/me`.
- **Goal keys** — stable API identifiers (`raise_capital`, …) in `app/constants/onboardContent.ts`; display text is i18n only.
- **Route access** — page protection level declared in `definePageMeta({ access })`; see `app/types/routes.ts`.
- **i18n** — `en` and `vn` with URL prefix (`/en/...`, `/vn/...`). Locale files: `locales/{en,vn}/forum-common.json`. Use `localePath()` for navigation; language switcher in the header. See `docs/conventions/translations.md`.

## Navigation

| If you are touching… | Read first |
|---|---|
| Route protection / redirects | `app/middleware/setup.global.ts`, `app/utils/routeGuards.ts`, `app/types/routes.ts` |
| Auth (login, register, reset) | `app/composables/auth/useSupabaseAuth.ts`, `app/composables/auth/useAuthCallbackPage.ts`, `app/utils/supabaseAuthCallback.ts`, `app/utils/authErrors.ts` |
| Profile / `/auth/me` | `app/composables/user/useUserProfile.ts`, `app/composables/api/useUserApi.ts` |
| Onboarding wizard | `app/composables/onboard/useOnboard.ts`, `app/pages/onboard/index.vue` |
| API calls | `app/composables/api/useApiConfig.ts` |
| Translations | `docs/conventions/translations.md` |
| System overview | [../ARCHITECTURE.md](../ARCHITECTURE.md) |
| Local dev stack | [../forum-server/README.md](../forum-server/README.md) |
| API contract | [../forum-api/README.md](../forum-api/README.md) |

## Route access (required for new pages)

Every page must declare how middleware treats it:

```ts
definePageMeta({ access: 'guest' })      // auth forms — redirects verified users to /social
definePageMeta({ access: 'callback' })   // email-link landing pages — never redirected
definePageMeta({ access: 'protected' })  // requires verified session
// omit access for public pages (default)
```

Global middleware (`app/middleware/setup.global.ts`) reads `to.meta.access` and delegates to `routeGuards.ts`. **Do not add path-string checks to middleware** — declare access on the page instead.

### SSR note

Protected-route profile sync and onboarding redirects run **client-only** (`import.meta.client`). SSR only checks Supabase session + email verification. Pages that depend on fresh profile data should await `refreshProfile()` in `onMounted`.

## Auth callback pages

`/auth/confirm` and `/auth/reset-password` use `useAuthCallbackPage()` → `completeAuthCallbackFromUrl()` for Supabase email links (hash tokens, `token_hash`, PKCE). URL param parsing lives in `app/utils/authCallbackParams.ts`. Supabase client config: `detectSessionInUrl: false`, `flowType: 'implicit'` in `nuxt.config.ts`.

Auth errors from Supabase or callback URLs go through `app/utils/authErrors.ts` (`mapSupabaseAuthError`, `mapAuthErrorString`) — never show raw API English.

## API integration

All forum-api calls go through composables in `app/composables/api/`:

- `useApiConfig()` — base URL + `Authorization: Bearer <supabase_access_token>`
- Hand-written types in `app/types/` — keep in sync with forum-api responses

No generated OpenAPI client. When changing API shapes, update both repos.

## Current state / known rough edges

- Types are duplicated with forum-api (`UserProfile`, goal keys) — no shared package yet.
- `app/pages/index.vue` has custom redirect logic instead of `access` meta.
- `@/` and `~/` import aliases are both used.
- `app/composables/index.ts` re-exports only a subset; import API composables by path.

## How to make changes

1. Read scoped files from the navigation table above.
2. For new pages: set `definePageMeta({ access: … })` and pick the right layout.
3. Keep diffs minimal; match surrounding conventions.
4. Run `bun run lint && bun run test`.
5. Verify on http://app.forum.test via `forum dev`.
