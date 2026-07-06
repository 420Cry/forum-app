import type {
  roleSelectionType,
  goalsSelectionType,
} from '~/types/onboard/onboardType'

export const roleSelection: roleSelectionType[] = [
  {
    roleTitle: 'Founder',
    titleKey: 'onboard.heading.founder_role_card',
    descriptionKey: 'onboard.info.founder_role_card',
    active: false,
    iconName: 'lightbulb',
  },
  {
    roleTitle: 'Investor',
    titleKey: 'onboard.heading.investor_role_card',
    descriptionKey: 'onboard.info.investor_role_card',
    active: false,
    iconName: 'accountBalance',
  },
]

export const goalsSelection: goalsSelectionType[] = [
  {
    role: 'Founder',
    active: true,
    goals: [
      {
        key: 'raise_capital',
        iconName: 'money',
        titleKey: 'onboard.heading.goal_raise_capital',
        subtitleKey: 'onboard.info.goal_raise_capital',
        active: false,
      },
      {
        key: 'find_cofounders',
        iconName: 'partner',
        titleKey: 'onboard.heading.goal_find_cofounders',
        subtitleKey: 'onboard.info.goal_find_cofounders',
        active: false,
      },
      {
        key: 'gather_feedback',
        iconName: 'feedback',
        titleKey: 'onboard.heading.goal_gather_feedback',
        subtitleKey: 'onboard.info.goal_gather_feedback',
        active: false,
      },
      {
        key: 'build_following',
        iconName: 'network',
        titleKey: 'onboard.heading.goal_build_following',
        subtitleKey: 'onboard.info.goal_build_following',
        active: false,
      },
    ],
  },
  {
    role: 'Investor',
    active: false,
    goals: [
      {
        key: 'discover_startups',
        iconName: 'search',
        titleKey: 'onboard.heading.goal_discover_startups',
        subtitleKey: 'onboard.info.goal_discover_startups',
        active: false,
      },
      {
        key: 'build_deal_flow',
        iconName: 'chart',
        titleKey: 'onboard.heading.goal_build_deal_flow',
        subtitleKey: 'onboard.info.goal_build_deal_flow',
        active: false,
      },
      {
        key: 'network_peers',
        iconName: 'peers',
        titleKey: 'onboard.heading.goal_network_peers',
        subtitleKey: 'onboard.info.goal_network_peers',
        active: false,
      },
      {
        key: 'market_insights',
        iconName: 'barChart',
        titleKey: 'onboard.heading.goal_market_insights',
        subtitleKey: 'onboard.info.goal_market_insights',
        active: false,
      },
    ],
  },
] as const
