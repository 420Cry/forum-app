import type { navigationLinkType } from '~/types/navigationType'

// Primary left-rail navigation for the protected home layout.
// `link` values are placeholders until the matching routes exist.
const navigationLinks: navigationLinkType[] = [
  {
    id: 'social',
    titleKey: 'nav.social',
    iconName: 'social',
    link: '/social',
  },
  {
    id: 'find',
    titleKey: 'nav.find',
    iconName: 'search',
    link: '/find',
  },
  {
    id: 'opportunities',
    titleKey: 'nav.opportunities',
    iconName: 'opportunity',
    link: '/opportunities',
  },
  {
    id: 'following',
    titleKey: 'nav.following',
    iconName: 'following',
    link: '/following',
  },
  {
    id: 'saved',
    titleKey: 'nav.saved',
    iconName: 'saved',
    link: '/saved',
  },
  {
    id: 'settings',
    titleKey: 'nav.settings',
    iconName: 'settings',
    link: '/settings',
  },
]

// Locale-aware variant for rendering: applies `localePath` to each link so
// navigation respects the active locale (`/en/...`, `/vn/...`).
export const useNavigationLinks = () => {
  const localePath = useLocalePath()

  return computed<navigationLinkType[]>(() =>
    navigationLinks.map(item => ({
      ...item,
      link: localePath(item.link),
    })),
  )
}
