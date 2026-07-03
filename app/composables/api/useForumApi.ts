import type { HealthResponse, MeResponse } from "../../types/api";
import { useApiConfig } from "./useApiConfig";

export function useForumApi() {
  const { baseUrl, getAuthHeaders } = useApiConfig();

  async function fetchHealth() {
    return $fetch<HealthResponse>(`${baseUrl}/health`, {
      credentials: "include",
    });
  }

  async function fetchHello() {
    return $fetch<string>(baseUrl, {
      credentials: "include",
    });
  }

  async function fetchMe() {
    const headers = await getAuthHeaders();
    return $fetch<MeResponse>(`${baseUrl}/auth/me`, {
      headers,
      credentials: "include",
    });
  }

  async function testApiCall() {
    try {
      const [health, hello] = await Promise.all([fetchHealth(), fetchHello()]);
      return { success: true, health, hello };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  return {
    baseUrl,
    fetchHealth,
    fetchHello,
    fetchMe,
    testApiCall,
  };
}
