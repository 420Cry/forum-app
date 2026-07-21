// Locale-aware variant for rendering: applies `localePath` to each link so
// navigation respects the active locale (`/en/...`, `/vn/...`).
import type { navigationLinkType } from '~/types/navigationType'
import { navigationLinks } from '~/constants/navigationLink'

export const useNavigationLinks = () => {
  const localePath = useLocalePath()

  return computed<navigationLinkType[]>(() =>
    navigationLinks.map(item => ({
      ...item,
      link: localePath(item.link),
    })),
  )
}
