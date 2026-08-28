import {
  AUTH_REDIRECT_QUERY,
  authReturnPathFromRoute,
} from '~/utils/authRedirect'

export type FollowSheetMode = 'followers' | 'following'

/**
 * Shared open / auth / ?list= handling for profile follow sheets.
 */
export function useProfileFollowSheet(options?: {
  /** Modes allowed on this profile (orgs omit following). */
  allowedModes?: FollowSheetMode[] | Ref<FollowSheetMode[]> | (() => FollowSheetMode[])
}) {
  const route = useRoute()
  const localePath = useLocalePath()
  const user = useSupabaseUser()
  const { profile: me } = useUserProfile()

  const sheetOpen = ref(false)
  const sheetMode = ref<FollowSheetMode>('followers')

  const allowed = computed(() => {
    const raw = options?.allowedModes
    if (!raw) return ['followers', 'following'] as FollowSheetMode[]
    if (typeof raw === 'function') return raw()
    if (isRef(raw)) return raw.value
    return raw
  })

  const isSignedIn = computed(() => !!user.value?.id || !!me.value?.id)

  function goSignIn() {
    const redirect = authReturnPathFromRoute(route.fullPath)
    return navigateTo({
      path: localePath('/auth/login'),
      query: redirect ? { [AUTH_REDIRECT_QUERY]: redirect } : undefined,
    })
  }

  function openSheet(mode: FollowSheetMode) {
    if (!allowed.value.includes(mode)) return
    if (!isSignedIn.value) {
      void goSignIn()
      return
    }
    sheetMode.value = mode
    sheetOpen.value = true
  }

  function onStatClick(key: string) {
    if (key === 'followers' || key === 'following') openSheet(key)
  }

  async function consumeListQuery() {
    const raw = route.query.list
    const value = Array.isArray(raw) ? raw[0] : raw
    if (value !== 'followers' && value !== 'following') return
    if (!allowed.value.includes(value)) {
      await navigateTo(
        { path: route.path, query: { ...route.query, list: undefined } },
        { replace: true },
      )
      return
    }
    if (!isSignedIn.value) {
      await goSignIn()
      return
    }
    sheetMode.value = value
    sheetOpen.value = true
    const nextQuery = { ...route.query }
    delete nextQuery.list
    await navigateTo({ path: route.path, query: nextQuery }, { replace: true })
  }

  onMounted(() => {
    void consumeListQuery()
  })

  watch(
    () => route.query.list,
    () => {
      void consumeListQuery()
    },
  )

  return {
    sheetOpen,
    sheetMode,
    isSignedIn,
    openSheet,
    onStatClick,
  }
}
