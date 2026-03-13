import type {
  roleSelectionType,
  goalsSelectionType,
} from "~/types/onboard/onboardType";

export const roleSelection: roleSelectionType[] = [
  {
    title: "I am a Founder",
    description:
      "I'm looking to showcase my startup, connect with investors, and raise capital.",
    active: false,
    iconName: "lightbulb",
  },
  {
    title: "I am an Investor",
    description:
      "I'm looking for high-potential startups to fund and diversify my portfolio.",
    active: false,
    iconName: "accountBalance",
  },
];

export const goalsSelection: goalsSelectionType[] = [
  {
    role: "Founders",
    active: true,
    goals: [
      {
        iconName: "money",
        title: "Raise Capital",
        subtitle:
          "Secure funding for your next major milestone and growth phase.",
      },
      {
        iconName: "partner",
        title: "Find Co-founders",
        subtitle:
          "Connect with talented partners who share your vision and passion.",
      },
      {
        iconName: "feedback",
        title: "Get Feedback",
        subtitle:
          "Improve your pitch and product with expert insights from veterans.",
      },
      {
        iconName: "network",
        title: "Build Network",
        subtitle:
          "Expand your reach and visibility within the global startup ecosystem.",
      },
    ],
  },
  {
    role: "Investors",
    active: false,
    goals: [
      {
        iconName: "search",
        title: "Discover Startups",
        subtitle:
          "Find high-potential early-stages project across various industries",
      },
      {
        iconName: "chart",
        title: "Build Deal Flow",
        subtitle:
          "Manage and track interesting investment opportunities in real-time",
      },
      {
        iconName: "peers",
        title: "Network with Peers",
        subtitle: "Connect with other angel investors, scouts and VC partners",
      },
      {
        iconName: "barChart",
        title: "Market Insights",
        subtitle:
          "Stay updated on the latest startup trends and ecosystem progress. ",
      },
    ],
  },
];
