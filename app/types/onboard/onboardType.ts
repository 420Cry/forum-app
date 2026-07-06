import type { iconNameType } from '~/types/iconType'
import type { goalsSelection } from '~/constants/onboardContent'

export const roleTitles = ['Founder', 'Investor'] as const
export type roleTitlesType = (typeof roleTitles)[number]

export type roleSelectionType = {
  roleTitle: roleTitlesType
  titleKey: string
  descriptionKey: string
  active: boolean
  iconName: iconNameType
}

export type goalListsType = {
  key: string
  iconName: iconNameType
  titleKey: string
  subtitleKey: string
  active: boolean
}

export type goalsSelectionType = {
  role: roleTitlesType
  active: boolean
  goals: goalListsType[]
}

export type goalKeyType
  = (typeof goalsSelection)[number]['goals'][number]['key']
