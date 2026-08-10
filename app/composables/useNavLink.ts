import type { navigationLinkType } from '~/types/navigationType'
import { navigationLinks } from '~/constants/navigationLink'

/** Locale-aware left-rail links (`/en/...`, `/vn/...`). */
export const useNavigationLinks = () => {
  const localePath = useLocalePath()

  return computed<navigationLinkType[]>(() =>
    navigationLinks.map(item => ({
      ...item,
      link: localePath(item.link),
    })),
  )
}
