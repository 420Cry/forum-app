import type { iconNameType } from '~/types/iconType'

export type navigationLinkType = {
  id: string
  titleKey: string
  iconName: iconNameType
  link: string
  // Prototype only: count will come from the API — hardcoded here to shape the response.
  count?: number
}
