# Forum App

Nuxt 4 frontend for the forum project.

## Setup

```bash
bun install
cp .env.example .env
```

For the full local stack, use [forum-server](../forum-server) instead of running the app in isolation.

### Environment

| File | Purpose |
| ---- | ------- |
| `.env` | Base config (staging, host-native, etc.) |
| `.env.local` | Local overrides for `forum dev` (gitignored) |

Copy templates:

```bash
cp .env.example .env
cp .env.local.example .env.local
```

Set in `.env` / `.env.local`:

| Variable | Description |
| -------- | ----------- |
| `NUXT_PUBLIC_FORUM_API_URL` | API base URL (`http://api.forum.test` with forum-server) |
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase API URL (`http://supabase.forum.test` locally) |
| `NUXT_PUBLIC_SUPABASE_KEY` | Supabase publishable (anon) key — run `forum env:sync` |

Add redirect URLs in the Supabase dashboard (or local `supabase/config.toml`). With locale-prefixed routes, include both `en` and `vn`:

- `http://app.forum.test/en/auth/confirm`
- `http://app.forum.test/vn/auth/confirm`
- `http://localhost:3000/en/auth/confirm`
- `http://localhost:3000/vn/auth/confirm`
- `http://app.forum.test/en/auth/reset-password`
- `http://app.forum.test/vn/auth/reset-password`
- `http://localhost:3000/en/auth/reset-password`
- `http://localhost:3000/vn/auth/reset-password`

Local `config.toml` uses `http://app.forum.test/**` wildcards, so prefixed paths are already allowed.

Local signup verification emails are captured by Supabase Inbucket. With `forum dev`, open **http://mail.forum.test** (also printed when the stack starts).

### Locales

Routes use a language prefix (`strategy: 'prefix'`): `/en/home`, `/vn/auth/login`. Visiting `/` redirects to the browser locale or `en`. Switch language from the header (EN / VN).

### Local hosts

Add forum dev hostnames when using forum-server:

```sh
# All forum hosts (safe to re-run)
for host in app.forum.test api.forum.test supabase.forum.test mail.forum.test; do
  grep -q "$host" /etc/hosts || echo "127.0.0.1 $host" | sudo tee -a /etc/hosts
done
```

Or only the email inbox:

```sh
grep -q 'mail.forum.test' /etc/hosts || echo '127.0.0.1 mail.forum.test' | sudo tee -a /etc/hosts
```

```
127.0.0.1 app.forum.test
127.0.0.1 api.forum.test
127.0.0.1 supabase.forum.test
127.0.0.1 mail.forum.test
```

**Email testing:** register at http://app.forum.test/auth/register, then open http://mail.forum.test for the verification email (also linked on the `/auth` verify screen in dev).

## Development

```bash
# Recommended — full stack with proxy + hot reload
forum dev

# App only (direct, no proxy)
bun run dev
```

App URL with forum-server: **http://app.forum.test**

### Dev server notes

- **Vite `allowedHosts`** — `nuxt.config.ts` allows `app.forum.test` so proxied requests are not blocked by Vite 6+ host checks.
- **Supabase cookies** — `cookieOptions.secure` is `false` in development so session cookies work over `http://app.forum.test`.

## Auth & routing

- Sign-in uses Supabase (`@nuxtjs/supabase`). After login, the app fetches `/auth/me` and routes via `postAuthPath()`:
  - `profile.onboarded === true` → `/home`
  - otherwise → `/onboard`
- Each page declares its access level via `definePageMeta({ access: 'guest' | 'callback' | 'protected' })`. Global middleware (`app/middleware/setup.global.ts`) reads this meta and delegates to `app/utils/routeGuards.ts`. See [AGENTS.md](./AGENTS.md) and [../ARCHITECTURE.md](../ARCHITECTURE.md).
- Email confirmation and password reset pages use `access: 'callback'` and are never redirected by middleware.

## Onboarding

Three UI steps (role → goals → basic info). State is kept client-side and **auto-saved as a draft** to `PATCH /user/onboarding/draft` (debounced ~800ms). Final step still submits everything via `POST /user/onboarding`. On return, `/auth/me` restores saved fields and `onboardingStep`.

Goal selections use stable API keys (`raise_capital`, `find_cofounders`, …) defined in `app/constants/onboardContent.ts`. Display text comes from i18n keys under `onboard.heading.goal_*` / `onboard.info.goal_*`.

## Translations

User-facing copy uses `@nuxtjs/i18n`. Locale file: `locales/en/forum-common.json`.

**Before adding or changing `t(...)` calls**, read [`docs/conventions/translations.md`](docs/conventions/translations.md) — keys must follow `<prefix>.<purpose>.<identifier>` (e.g. `auth.heading.sign_in`).

## Scripts

```bash
bun run build
bun run lint
bun run lint:fix
bun run test          # vitest (run once)
bun run test:watch    # vitest watch
```

Tests cover auth session helpers, user routing helpers, and onboarding form validation (`tests/`).

## Local dev troubleshooting

| Issue | Fix |
| ----- | --- |
| `user_already_exists` on register after deleting in Studio | Delete from `auth.users`, not only `public.users`. Run `forum db:delete-user <email>`. |
| Blocked request / host not allowed | Ensure `vite.server.allowedHosts` includes `app.forum.test` and restart `forum dev`. |
| Kicked to login after reload on `http://` | Confirm `supabase.cookieOptions.secure` is not `true` in development. |
