# Translations

Source: `@nuxtjs/i18n` with locale files under `locales/{en,vn}/forum-common.json`. Config lives in `nuxt.config.ts` (`defaultLocale: 'en'`, `strategy: 'no_prefix'`).

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

## Rules

- **No hardcoded user-facing strings** in templates or components — use `t(...)`.
- Every full key must be globally unique.
- Add the key to **both** `locales/en/forum-common.json` and `locales/vn/forum-common.json` in the same PR.
- Keep JSON nested by segment (`auth.heading.sign_in` → `auth → heading → sign_in`).
- Goal **display** text lives in i18n (`onboard.heading.goal_*`, `onboard.info.goal_*`). Goal **API** values use stable keys from `app/constants/onboardContent.ts` — never send translated labels to the API.
- Interpolation uses `{name}` placeholders (e.g. `{email}`, `{count}`).

## Workflow

1. Add or change a `t('...')` call in code.
2. Add matching entries under the same path in `locales/en/forum-common.json` and `locales/vn/forum-common.json`.
3. Switch locale in the app (browser language / `forum_locale` cookie) and spot-check both languages.
