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

  async function createSession(): Promise<string> {
    const headers = await getAuthHeaders(true);
    const res = await $fetch(`${baseUrl}/auth/session`, {
      headers,
      method: "POST",
      credentials: "include",
    });
    return res as string;
  }

  async function clearSession(): Promise<{ success: boolean }> {
    const result = await $fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    return result as { success: boolean };
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
    createSession,
    clearSession,
  };
}
