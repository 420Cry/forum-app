import type { RolePayload } from "~/types/onboard/schema/rolePayloadSchema";
import { useApiConfig } from "../useApiConfig";
import type { OnboardResponse } from "~/types/onboard/api";

export function useOnboardApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig();

  async function saveUserRole(payload: RolePayload) {
    const headers = await getAuthHeaders();
    return await $fetch<OnboardResponse>(`${baseUrl}/user/role`, {
      method: "POST",
      headers,
      body: payload,
    });
  }

  async function saveUserGoals(goals: string[]) {
    const headers = await getAuthHeaders();
    return await $fetch<OnboardResponse>(`${baseUrl}/user/goals`, {
      method: "POST",
      headers,
      body: { goals },
    });
  }

  return { saveUserRole, saveUserGoals };
}
