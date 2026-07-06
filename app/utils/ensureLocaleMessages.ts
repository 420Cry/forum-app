/** Wait for lazy-loaded locale messages before mapping auth errors on callback pages. */
export async function ensureLocaleMessagesLoaded() {
  const { locale, loadLocaleMessages } = useI18n()
  await loadLocaleMessages(locale.value)
}
