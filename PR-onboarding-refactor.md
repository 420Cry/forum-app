# 4FOR-32: Refactor onboarding UX

## Summary

- Move onboarding to a client-side 3-step flow with a single submit on finish
- Autosave draft progress (debounced) and resume from `profile.onboardingStep`
- Match goals by stable keys instead of display names
- Route on `profile.onboarded` — keep incomplete users off `/home`
- Introduce i18n (`@nuxtjs/i18n`) — move UI copy to `locales/{en,vn}/forum-common.json`; see `docs/conventions/translations.md`
- Fix auth/session issues: login navigation, cookie `secure` in dev, stale profile cache, browser-back redirects
- Add `eslint-plugin-unused-imports` — error on unused imports/vars (`^_` ignored)
- Add tests for draft payload, profile cache, and auth helpers

## Test plan

- [ ] New user completes onboarding end-to-end
- [ ] Refresh mid-flow resumes the correct step
- [ ] Browser back from `/home` redirects to `/onboard` when not onboarded
- [ ] Login lands on the right page after profile loads
- [ ] `bun run lint` passes (including unused-imports rule)
- [ ] Copy renders in `en` and `vn` (no hardcoded UI strings)

## Related

- forum-api `4FOR-33`
- forum-server `4FOR-33`
