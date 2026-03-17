import type { iconNameType } from "~/types/iconType";

export type roleSelectionType = {
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
  role: "Founders" | "Investors";
  active: boolean;
  goals: goalListsType[];
};
