import type { iconNameType } from '~/types/iconType'

export type navigationLinkType = {
  id: string
  titleKey: string
  iconName: iconNameType
  link: string
  count?: number
}
