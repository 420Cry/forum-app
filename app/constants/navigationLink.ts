import type { navigationLinkType } from '~/types/navigationType'

/** Primary left-rail nav for the protected app shell (Trusted Standard). */
export const navigationLinks: navigationLinkType[] = [
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
    id: 'following',
    titleKey: 'nav.following',
    iconName: 'following',
    link: '/following',
  },
  {
    id: 'settings',
    titleKey: 'nav.settings',
    iconName: 'settings',
    link: '/settings',
  },
]
