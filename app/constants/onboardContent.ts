import type { iconNameType } from "~/types/iconType";
export type roleSelectionType = {
  title: string;
  description: string;
  active: boolean;
  iconName: iconNameType;
};

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
