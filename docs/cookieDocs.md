# Cookie and legal copy

Product draft for Fundedr cookie consent and the public legal pages. Not lawyer-reviewed.

When you change **cookies**, **privacy**, or **terms**, treat them as one product. Update the other legal pages and both locale files in the same change.

## Consent groups

Stored in `forum_cookie_consent` (1 year, `lax`, path `/`). Shape and helpers live in [`app/utils/cookieConsent.ts`](../app/utils/cookieConsent.ts). Version is `COOKIE_CONSENT_VERSION` (`v: 1`). A bump invalidates old stored choices.

| Group | Can the user turn it off? | Runs in the product today? |
| --- | --- | --- |
| Strictly necessary | No | Yes |
| Performance | Yes | **No** |
| Functional | Yes | **No** |
| Targeting | Yes | **No** |

Necessary cookies (always on):

| Name | Purpose | Duration |
| --- | --- | --- |
| `forum_locale` | Language | Until language change or site data clear |
| `sb-…-auth-token` | Sign-in session | 7 days |
| `forum_cookie_consent` | Stores this notice / group choices | 1 year |

These are first-party Fundedr cookies. Processor names (Supabase, Sendbird) belong on the **privacy** page, not this table.

`LIVE_OPTIONAL_GROUPS` is `[]`. Optional switches only **persist a choice**. They do not load scripts.

### If you add an optional cookie later

1. Put the group in `LIVE_OPTIONAL_GROUPS` (`performance` / `functional` / `targeting`).
2. Add the cookie to `COOKIE_INVENTORY` and the policy table copy.
3. Gate the script with `groupAllowed` (or the matching `*Allowed` computed from `useCookieConsent`). Do not load it unless that group is on:

```ts
const { performanceAllowed, functionalAllowed, targetingAllowed } = useCookieConsent()

if (performanceAllowed.value) {
  // analytics / measurement only
}

if (functionalAllowed.value) {
  // extra personalization cookies only
}

if (targetingAllowed.value) {
  // ads / marketing / social pixels only
}
```

4. Update cookie policy, privacy (cookies section), banner, and drawer copy in **en and vn**.
5. Extend [`tests/cookieConsent.test.ts`](../tests/cookieConsent.test.ts) and smoke tests in forum-test-automation.

Until a group is live, do not claim in UI copy that we set that cookie today.

## UI

| Surface | File | Role |
| --- | --- | --- |
| Banner | [`CookieBanner.vue`](../app/components/legal/CookieBanner.vue) | Until a choice exists: Accept all, Cookie configuration, Reject all |
| Drawer | [`CookiePreferencesDialog.vue`](../app/components/legal/CookiePreferencesDialog.vue) | Necessary locked; optional switches; Accept all / Save / Reject all |
| Footer | [`LegalFooter.vue`](../app/components/legal/LegalFooter.vue) + [`AppLegalFooter.vue`](../app/components/legal/AppLegalFooter.vue) | Cookie settings + legal links. Hidden on `/messages` |
| Legal pages | [`LegalPage.vue`](../app/components/legal/LegalPage.vue) + [`LegalSection.vue`](../app/components/legal/LegalSection.vue) | Shared article layout for cookies / privacy / terms |
| Settings | [`settings/index.vue`](../app/pages/settings/index.vue) | Reopens the drawer |
| Composable | [`useCookieConsent.ts`](../app/composables/useCookieConsent.ts) | Persist, open/close drawer, `*Allowed` flags |

Accept all writes all optional groups `true`. Reject all writes them `false`. Necessary stays `true`.

## Legal pages (keep in sync)

Public routes (`layout: 'home'`, `access: 'public'`), locale-prefixed (`/en/legal/...`, `/vn/legal/...`).

| Page | Route | Vue | Copy keys (both `locales/en` and `locales/vn`) |
| --- | --- | --- | --- |
| Cookie policy | `/legal/cookies` | [`cookies.vue`](../app/pages/legal/cookies.vue) | `common.info.cookie_*`, `common.heading.cookie_*` |
| Privacy policy | `/legal/privacy` | [`privacy.vue`](../app/pages/legal/privacy.vue) | `common.info.privacy_*`, `common.heading.privacy_*` |
| Terms of use | `/legal/terms` | [`terms.vue`](../app/pages/legal/terms.vue) | `common.info.terms_*`, `common.heading.terms_*` |

Register links Terms + Privacy ([`register.vue`](../app/pages/auth/register.vue), `auth.info.agree_terms`). Privacy links the cookie policy (`common.info.privacy_cookies`). Footer and banner link all three.

### If you update terms (or any legal page)

Do this in the **same PR**:

1. **Terms** (`common.info.terms_*`) — what you actually changed.
2. **Privacy** — data, processors, cookies, rights, contact; must not contradict terms.
3. **Cookie policy** — inventory, categories, how to change preferences; must not contradict privacy cookies section.
4. **Banner + drawer** — `common.info.cookie_banner`, `cookie_preferences`, group blurbs.
5. **Both locales** — `locales/en/forum-common.json` and `locales/vn/forum-common.json`.
6. **Smoke** — SMK09 banner, SMK10 cookie policy, SMK11 privacy and terms (`forum-test-automation/tests/e2e/smoke/cookies.smoke.spec.ts`).

If operator name, contact, or retention changes, those strings appear on privacy **and** cookie policy (controller / contact). Update both.

## Tests

- Unit: [`forum-app/tests/cookieConsent.test.ts`](../tests/cookieConsent.test.ts)
- Locale key parity: `forum-app/tests/localeParity.test.ts`
- E2E: SMK09–SMK11 as above. Auth setup injects rejected consent via [`cookieConsent.ts`](../../forum-test-automation/tests/support/helpers/cookieConsent.ts)
