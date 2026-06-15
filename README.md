# Forum App

Nuxt 4 frontend for the forum project

## Setup

```bash
bun install
cp .env.example .env
```

Set in `.env`:

- `NUXT_PUBLIC_FORUM_API_URL` — API base URL (e.g. `http://api.forum.test`)
- `NUXT_PUBLIC_SUPABASE_URL` — Supabase project URL (`https://<project-id>.supabase.co`)
- `NUXT_PUBLIC_SUPABASE_KEY` — Supabase publishable (anon) key

Add redirect URLs in the Supabase dashboard:

- `http://app.forum.test/auth/confirm`
- `http://localhost:3000/auth/confirm`
- `http://app.forum.test/auth/reset-password`
- `http://localhost:3000/auth/reset-password`

## Development

```bash
bun run dev
```

Or use [forum-server](../forum-server) for the full local stack (`bin/forum up`).

## Scripts

```bash
bun run build
bun run lint
bun run lint:fix
```
