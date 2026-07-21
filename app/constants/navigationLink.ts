import type { navigationLinkType } from '~/types/navigationType'

// Primary left-rail navigation for the protected home layout.
// `link` values are placeholders until the matching routes exist.
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
    id: 'opportunities',
    titleKey: 'nav.opportunities',
    iconName: 'opportunity',
    link: '/opportunities',
    count: 12,
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
    count: 4,
  },
  {
    id: 'settings',
    titleKey: 'nav.settings',
    iconName: 'settings',
    link: '/settings',
  },
]
