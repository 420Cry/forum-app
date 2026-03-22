import type { iconNameType } from "~/types/iconType";
import type { goalsSelection } from "~/constants/onboardContent";

export type roleTitlesType = "Founder" | "Investor";

export type roleSelectionType = {
  roleTitle: roleTitlesType;
  title: string;
  description: string;
  active: boolean;
  iconName: iconNameType;
};

export type goalListsType = {
  iconName: iconNameType;
  title: string;
  subtitle: string;
  active: boolean;
};

export type goalsSelectionType = {
  role: roleTitlesType;
  active: boolean;
  goals: goalListsType[];
};

export type goalTitlesType =
  (typeof goalsSelection)[number]["goals"][number]["title"];
