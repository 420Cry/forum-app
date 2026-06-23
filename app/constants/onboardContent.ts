import type {
  roleSelectionType,
  goalsSelectionType,
} from "~/types/onboard/onboardType";

export const roleSelection: roleSelectionType[] = [
  {
    roleTitle: "Founder",
    title: "I'm a Founder",
    description:
      "I'm building a company and want to share progress, meet investors, and grow a following.",
    active: false,
    iconName: "lightbulb",
  },
  {
    roleTitle: "Investor",
    title: "I'm an Investor",
    description:
      "I want to discover early-stage founders, track promising companies, and build my deal flow.",
    active: false,
    iconName: "accountBalance",
  },
];

export const goalsSelection: goalsSelectionType[] = [
  {
    role: "Founder",
    active: true,
    goals: [
      {
        iconName: "money",
        title: "Raise capital",
        subtitle: "Connect with angels actively writing first cheques in your sector.",
        active: false,
      },
      {
        iconName: "partner",
        title: "Find co-founders",
        subtitle: "Meet a technical or commercial partner the next chapter needs.",
        active: false,
      },
      {
        iconName: "feedback",
        title: "Gather feedback",
        subtitle: "Hear from operators before the round, while the product can still move.",
        active: false,
      },
      {
        iconName: "network",
        title: "Build a following",
        subtitle: "Publish progress notes so the right readers find you over time.",
        active: false,
      },
    ],
  },
  {
    role: "Investor",
    active: false,
    goals: [
      {
        iconName: "search",
        title: "Discover startups",
        subtitle: "Surface high-potential early-stage companies across industries you care about.",
        active: false,
      },
      {
        iconName: "chart",
        title: "Build deal flow",
        subtitle: "Track promising opportunities as they evolve, in real time, in one place.",
        active: false,
      },
      {
        iconName: "peers",
        title: "Network with peers",
        subtitle: "Read alongside other angels, scouts, and VC partners at the same edge.",
        active: false,
      },
      {
        iconName: "barChart",
        title: "Market insights",
        subtitle: "Stay close to trends and ecosystem shifts that change which bets make sense.",
        active: false,
      },
    ],
  },
] as const;
