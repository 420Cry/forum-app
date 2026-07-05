import type { AuthMeResponse } from "~/types/user";
import { isOnboardingComplete } from "~/types/user";
import { useUserApi } from "./api/useUserApi";

export function useUserProfile() {
  const profile = useState<AuthMeResponse | null>("forum-user-me", () => null);
  const loading = useState("forum-user-me-loading", () => false);

  const isComplete = computed(() =>
    isOnboardingComplete(profile.value?.profile ?? null),
  );

  async function refreshProfile(force = false) {
    if (!force && profile.value) return profile.value;

    loading.value = true;
    try {
      const { fetchMe } = useUserApi();
      profile.value = await fetchMe();
      return profile.value;
    } catch {
      profile.value = null;
      return null;
    } finally {
      loading.value = false;
    }
  }

  function clearProfile() {
    profile.value = null;
  }

  return {
    profile,
    loading,
    isComplete,
    refreshProfile,
    clearProfile,
  };
}
