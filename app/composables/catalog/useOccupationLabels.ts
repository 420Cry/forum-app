/**
 * Resolve occupation display labels via BE catalog (translations live in forum-api).
 * Caches the full catalog once per locale for directory/profile remapping.
 */
import { useOccupationsApi } from '~/composables/api/useOccupationsApi'

export function useOccupationLabels() {
  const { searchOccupations, resolveOccupationName } = useOccupationsApi()
  const { locale } = useI18n()

  const cache = useState<Record<string, Record<string, string>>>(
    'forum-occupation-label-cache',
    () => ({}),
  )
  const inflight = useState<Record<string, Promise<void> | null>>(
    'forum-occupation-label-inflight',
    () => ({}),
  )

  async function ensureLoaded() {
    const loc = locale.value
    if (cache.value[loc] && Object.keys(cache.value[loc]!).length > 0) return
    if (inflight.value[loc]) {
      await inflight.value[loc]
      return
    }

    inflight.value[loc] = (async () => {
      const result = await searchOccupations('', 0, 2000)
      const map: Record<string, string> = {}
      for (const row of result.rows) map[row.key] = row.name
      cache.value = { ...cache.value, [loc]: map }
    })().finally(() => {
      inflight.value = { ...inflight.value, [loc]: null }
    })

    await inflight.value[loc]
  }

  function label(key: string, fallback: string): string {
    const loc = locale.value
    return cache.value[loc]?.[key] ?? fallback
  }

  async function resolve(key: string, fallback: string): Promise<string> {
    await ensureLoaded()
    const fromCache = label(key, '')
    if (fromCache) return fromCache
    const fromApi = await resolveOccupationName(key)
    return fromApi ?? fallback
  }

  return { ensureLoaded, label, resolve }
}
