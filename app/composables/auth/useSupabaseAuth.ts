import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useForumApi } from "../api/useForumApi";
import { useForumSession } from "../session/useForumSession";

export interface AuthUser {
  id: string;
  email: string | null;
  emailVerified: boolean;
}

function toAuthUser(u: SupabaseUser | null | undefined): AuthUser | null {
  if (!u) return null;
  return {
    id: u.id,
    email: u.email ?? null,
    emailVerified: !!u.email_confirmed_at,
  };
}

function getEmailRedirectUrl(): string {
  if (import.meta.client) {
    return `${window.location.origin}/auth/confirm`;
  }
  return `${useRequestURL().origin}/auth/confirm`;
}

let isListenerAttached = false;

export function useSupabaseAuth() {
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();
  const refreshedUser = useState<SupabaseUser | null>(
    "supabase-refreshed-user",
    () => null,
  );

  const loading = ref(false);
  const error = ref<string | null>(null);

  const user = computed(() =>
    toAuthUser(refreshedUser.value ?? supabaseUser.value),
  );
  const isAuthenticated = computed(() => !!user.value);

  if (import.meta.client && !isListenerAttached) {
    isListenerAttached = true;

    supabase.auth.onAuthStateChange(async (event) => {
      if (
        event === "SIGNED_IN" ||
        event === "USER_UPDATED" ||
        event === "TOKEN_REFRESHED"
      ) {
        const { data } = await supabase.auth.getUser();
        refreshedUser.value = data.user;
      }
      if (event === "SIGNED_OUT") {
        refreshedUser.value = null;
      }
    });

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        user.value &&
        !user.value.emailVerified
      ) {
        void refreshUser();
      }
    };
    onMounted(() =>
      document.addEventListener("visibilitychange", handleVisibilityChange),
    );
    onUnmounted(() =>
      document.removeEventListener("visibilitychange", handleVisibilityChange),
    );
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (err) {
        error.value =
          err.code === "email_not_confirmed"
            ? "Please verify your email before signing in. Check your inbox for the verification link."
            : err.message;
        return;
      }
      await refreshUser();
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getEmailRedirectUrl(),
        },
      });
      if (err) {
        error.value = err.message;
        return;
      }
      refreshedUser.value = data.user;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    useForumSession().clear();
    error.value = null;
    refreshedUser.value = null;
    await supabase.auth.signOut();
    await useForumApi()
      .clearSession()
      .catch(() => {});
  }

  async function getAccessToken(forceRefresh = false): Promise<string | null> {
    if (forceRefresh) {
      const { data } = await supabase.auth.refreshSession();
      return data.session?.access_token ?? null;
    }
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function resetPassword(email: string) {
    loading.value = true;
    error.value = null;
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getEmailRedirectUrl(),
      });
      if (err) error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function refreshUser(): Promise<boolean> {
    await supabase.auth.refreshSession();
    const { data } = await supabase.auth.getUser();
    refreshedUser.value = data.user;
    if (data.user?.email_confirmed_at) {
      const { fetchMe } = useForumApi();
      await fetchMe().catch(() => {});
      return true;
    }
    return false;
  }

  async function resendVerificationEmail() {
    if (!user.value?.email) {
      error.value = "Not signed in";
      return;
    }
    if (user.value.emailVerified) {
      error.value = "Email already verified";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const { error: err } = await supabase.auth.resend({
        type: "signup",
        email: user.value.email,
        options: {
          emailRedirectTo: getEmailRedirectUrl(),
        },
      });
      if (err) error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  function clearError() {
    error.value = null;
  }

  return {
    user,
    loading,
    error,
    clearError,
    isAuthenticated,
    login,
    register,
    logout,
    getAccessToken,
    resetPassword,
    refreshUser,
    resendVerificationEmail,
  };
}
