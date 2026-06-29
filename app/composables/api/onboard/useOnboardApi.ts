import type { RolePayload } from "~/types/onboard/schema/rolePayloadSchema";
import { useApiConfig } from "../useApiConfig";
import type { UserRoleResponse } from "~/types/onboard/api";

export function useOnboardApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig();

  async function saveUserRole(payload: RolePayload) {
    const headers = await getAuthHeaders();
    return await $fetch<UserRoleResponse>(`${baseUrl}/user/role`, {
      method: "POST",
      headers,
      body: payload,
    });
  }

  return { saveUserRole };
}
