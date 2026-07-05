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
        iconName: 'money',
        title: 'Raise capital',
        titleKey: 'onboard.heading.goal_raise_capital',
        subtitleKey: 'onboard.info.goal_raise_capital',
        active: false,
      },
      {
        iconName: 'partner',
        title: 'Find co-founders',
        titleKey: 'onboard.heading.goal_find_cofounders',
        subtitleKey: 'onboard.info.goal_find_cofounders',
        active: false,
      },
      {
        iconName: 'feedback',
        title: 'Gather feedback',
        titleKey: 'onboard.heading.goal_gather_feedback',
        subtitleKey: 'onboard.info.goal_gather_feedback',
        active: false,
      },
      {
        iconName: 'network',
        title: 'Build a following',
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
        iconName: 'search',
        title: 'Discover startups',
        titleKey: 'onboard.heading.goal_discover_startups',
        subtitleKey: 'onboard.info.goal_discover_startups',
        active: false,
      },
      {
        iconName: 'chart',
        title: 'Build deal flow',
        titleKey: 'onboard.heading.goal_build_deal_flow',
        subtitleKey: 'onboard.info.goal_build_deal_flow',
        active: false,
      },
      {
        iconName: 'peers',
        title: 'Network with peers',
        titleKey: 'onboard.heading.goal_network_peers',
        subtitleKey: 'onboard.info.goal_network_peers',
        active: false,
      },
      {
        iconName: 'barChart',
        title: 'Market insights',
        titleKey: 'onboard.heading.goal_market_insights',
        subtitleKey: 'onboard.info.goal_market_insights',
        active: false,
      },
    ],
  },
] as const
