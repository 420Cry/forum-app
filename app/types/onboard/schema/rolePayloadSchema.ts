import z from "zod";
import { roleTitles } from "../onboardType";

export const RolePayload = z.object({
  role: z.enum(roleTitles, "User role can only be Startup or Investor"),
});

export type RolePayload = z.infer<typeof RolePayload>;
