import {
  AUTH_REDIRECT_QUERY,
  sanitizeAuthRedirect,
} from '~/utils/authRedirect'

export function useAuthRedirectLinks() {
  const route = useRoute()
  const localePath = useLocalePath()

  const redirectParam = computed(() =>
    sanitizeAuthRedirect(route.query[AUTH_REDIRECT_QUERY]),
  )

  function pathWithRedirect(path: string) {
    return {
      path: localePath(path),
      query: redirectParam.value
        ? { [AUTH_REDIRECT_QUERY]: redirectParam.value }
        : undefined,
    }
  }

  const loginTo = computed(() => pathWithRedirect('/auth/login'))
  const registerTo = computed(() => pathWithRedirect('/auth/register'))

  return { redirectParam, loginTo, registerTo }
}
