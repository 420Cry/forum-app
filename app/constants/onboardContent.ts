import type {
  roleSelectionType,
  goalsSelectionType,
} from "~/types/onboard/onboardType";

export const roleSelection: roleSelectionType[] = [
  {
    roleTitle: "Founder",
    title: "I am a Founder",
    description:
      "I'm looking to showcase my startup, connect with investors, and raise capital.",
    active: false,
    iconName: "lightbulb",
  },
  {
    roleTitle: "Investor",
    title: "I am an Investor",
    description:
      "I'm looking for high-potential startups to fund and diversify my portfolio.",
    active: false,
    iconName: "accountBalance",
  },
];

//TODO: Default role = Founders, map based on the first answer
export const goalsSelection: goalsSelectionType[] = [
  {
    role: "Founder",
    active: true,
    goals: [
      {
        iconName: "money",
        title: "Raise Capital",
        subtitle:
          "Secure funding for your next major milestone and growth phase.",
        active: false,
      },
      {
        iconName: "partner",
        title: "Find Co-founders",
        subtitle:
          "Connect with talented partners who share your vision and passion.",
        active: false,
      },
      {
        iconName: "feedback",
        title: "Get Feedback",
        subtitle:
          "Improve your pitch and product with expert insights from veterans.",
        active: false,
      },
      {
        iconName: "network",
        title: "Build Network",
        subtitle:
          "Expand your reach and visibility within the global startup ecosystem.",
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
        title: "Discover Startups",
        subtitle:
          "Find high-potential early-stages project across various industries",
        active: false,
      },
      {
        iconName: "chart",
        title: "Build Deal Flow",
        subtitle:
          "Manage and track interesting investment opportunities in real-time",
        active: false,
      },
      {
        iconName: "peers",
        title: "Network with Peers",
        subtitle: "Connect with other angel investors, scouts and VC partners",
        active: false,
      },
      {
        iconName: "barChart",
        title: "Market Insights",
        subtitle:
          "Stay updated on the latest startup trends and ecosystem progress. ",
        active: false,
      },
    ],
  },
] as const;
