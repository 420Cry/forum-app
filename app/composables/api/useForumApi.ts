import type { HealthResponse, MeResponse } from "../../types/api";
import { useSupabaseToken } from "../auth/useSupabaseToken";

export function useForumApi() {
  const config = useRuntimeConfig();
  const baseUrl = config.public.forumApiUrl;
  const { getAccessToken } = useSupabaseToken();

  async function getAuthHeaders(
    forceRefresh = false,
  ): Promise<Record<string, string>> {
    const token = await getAccessToken(forceRefresh);
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchHealth() {
    return $fetch<HealthResponse>(`${baseUrl}/health`);
  }

  async function fetchHello() {
    return $fetch<string>(baseUrl);
  }

  async function fetchMe() {
    const headers = await getAuthHeaders();
    return $fetch<MeResponse>(`${baseUrl}/auth/me`, { headers });
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
