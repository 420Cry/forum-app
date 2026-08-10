import { useProfilesApi } from '~/composables/api/useProfilesApi'
import type { PublicUserProfile } from '~/types/profile'
import {
  goalCatalogLabel,
  locationCatalogLabel,
  occupationCatalogLabel,
} from '~/utils/catalogLabel'
import { resolveViewerId } from '~/utils/viewerId'

export function usePublicUserPage(routeKey: MaybeRefOrGetter<string>) {
  const { t, te } = useI18n()
  const localePath = useLocalePath()
  const user = useSupabaseUser()
  const { profile: me } = useUserProfile()
  const { getPublicUser } = useProfilesApi()

  const profile = ref<PublicUserProfile | null>(null)
  const error = ref(false)
  const loading = ref(true)
  const isOwnProfile = ref(false)

  const facts = computed(() => {
    const p = profile.value
    if (!p) return [] as { key: string, value: string, chips?: string[] }[]
    const rows: { key: string, value: string, chips?: string[] }[] = []
    if (p.role) rows.push({ key: t('profiles.fact.role'), value: p.role })
    if (p.occupation) {
      const occupationKey = p.occupationKey ?? ''
      rows.push({
        key: t('profiles.fact.occupation'),
        value: occupationKey
          ? occupationCatalogLabel(occupationKey, p.occupation, t, te)
          : p.occupation,
      })
    }
    if (p.location) {
      const locationKey = p.locationKey ?? ''
      rows.push({
        key: t('profiles.fact.location'),
        value: locationKey
          ? locationCatalogLabel(locationKey, p.location, t, te)
          : p.location,
      })
    }
    if (p.goals.length) {
      const goalLabels = p.goals.map(key => goalCatalogLabel(key, key, t, te))
      rows.push({
        key: t('profiles.fact.goals'),
        value: goalLabels.join(', '),
        chips: goalLabels,
      })
    }
    return rows
  })

  const occupationTagline = computed(() => {
    const p = profile.value
    if (!p?.occupation) return null
    const key = p.occupationKey ?? ''
    return key
      ? occupationCatalogLabel(key, p.occupation, t, te)
      : p.occupation
  })

  async function load() {
    loading.value = true
    error.value = false
    try {
      const key = toValue(routeKey)
      const [viewerId, next] = await Promise.all([
        resolveViewerId(user.value?.id, me.value?.id),
        getPublicUser(key),
      ])
      isOwnProfile.value = !!viewerId && next.id === viewerId
      profile.value = next
      if (next.urlKey !== key) {
        await navigateTo(localePath(next.profilePath), { replace: true })
      }
    }
    catch {
      error.value = true
      profile.value = null
    }
    finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void load()
  })

  return {
    profile,
    error,
    loading,
    isOwnProfile,
    facts,
    occupationTagline,
    load,
  }
}
