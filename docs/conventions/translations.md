# Translations

Source: `@nuxtjs/i18n` with locale files under `locales/{en,vn}/forum-common.json`. Config lives in `nuxt.config.ts` (`defaultLocale: 'en'`, `strategy: 'prefix'`).

URLs include the locale code: `/en/home`, `/vn/auth/login`. Use `useLocalePath()` for navigation and `useSwitchLocalePath()` for the language switcher.

## Locales

| Code | File | Notes |
|------|------|-------|
| `en` | `locales/en/forum-common.json` | Default |
| `vn` | `locales/vn/forum-common.json` | Vietnamese |

When adding or changing a key, update **both** locale files in the same PR.

## Key shape

**New keys must** use a strict three-segment, dot-delimited pattern:

```
<key-prefix>.<purpose>.<identifier>
```

### `<key-prefix>` — feature or shared scope

```
common      ← shared UI (buttons, generic errors)
auth        ← sign-in, register, password reset, email verify
onboard     ← onboarding flow
```

If you can't confidently choose, default to `common`.

### `<purpose>` — semantic role

```
action      ← call-to-action (buttons, links)
heading     ← section or page titles
label       ← form-field labels & placeholders
info        ← general informational copy & help text
error       ← validation or runtime error messages
aria        ← accessibility labels (aria-label, alt text)
```

### `<identifier>` — short slug

Lowercase, words joined by underscores, no punctuation. Prefer `verb_noun` for actions and noun phrases for info.

```
sign_in
try_again
select_role
goal_raise_capital
```

## Examples

```vue
{{ t('auth.heading.sign_in') }}
{{ t('common.action.continue') }}
{{ t('onboard.error.select_goal') }}
{{ t('common.info.selected_count', { count: selectedCount }) }}
```

```ts
const localePath = useLocalePath()
await navigateTo(localePath('/auth/login'))
```

## Rules

- **No hardcoded user-facing strings** in templates or components — use `t(...)`.
- Every full key must be globally unique.
- Add the key to both `locales/en/forum-common.json` and `locales/vn/forum-common.json` in the same PR as the `t(...)` call.
- Keep JSON nested by segment (`auth.heading.sign_in` → `auth → heading → sign_in`).
- Goal **display** text lives in i18n (`onboard.heading.goal_*`, `onboard.info.goal_*`). Goal **API** values use stable keys from `app/constants/onboardContent.ts` — never send translated labels to the API.
- Interpolation uses `{name}` placeholders (e.g. `{email}`, `{count}`).
- Use `localePath()` for internal links and redirects; route guards compare logical paths via `stripLocalePrefix()`.
- Supabase auth errors must go through `mapSupabaseAuthError()` / `mapAuthErrorString()` in `app/utils/authErrors.ts` — never show raw API English in the UI.

## Workflow

1. Add or change a `t('...')` call in code.
2. Add the matching entry under the same path in both locale files.
3. Spot-check the string in the app at `/en/...` and `/vn/...`.
