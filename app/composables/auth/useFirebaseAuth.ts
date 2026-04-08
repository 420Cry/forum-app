import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { useForumApi } from "../api/useForumApi";
import { useForumSession } from "../session/useForumSession";

let isListenerAttached = false;
export function useFirebaseAuth() {
  const { $firebaseAuth } = useNuxtApp();
  const user = useState<User | null>("firebase-user", () => null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value);

  if ($firebaseAuth && !isListenerAttached) {
    isListenerAttached = true;
    onAuthStateChanged($firebaseAuth, async (u) => {
      user.value = u;
    });

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        user.value &&
        !user.value.emailVerified
      ) {
        refreshUser();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    onUnmounted(() =>
      document.removeEventListener("visibilitychange", handleVisibilityChange),
    );
  }

  async function login(email: string, password: string) {
    if (!$firebaseAuth) {
      error.value = "Firebase not configured";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const cred = await signInWithEmailAndPassword(
        $firebaseAuth,
        email,
        password,
      );
      try {
        await reload(cred.user);
      } catch {
        // Reload can fail (e.g. network). Use cred.user for emailVerified check.
      }
      const currentUser = $firebaseAuth.currentUser ?? cred.user;
      if (!currentUser.emailVerified) {
        await signOut($firebaseAuth);
        user.value = null;
        error.value =
          "Please verify your email before signing in. Check your inbox for the verification link.";
        return;
      }
      user.value = currentUser;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string) {
    if (!$firebaseAuth) {
      error.value = "Firebase not configured";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const cred = await createUserWithEmailAndPassword(
        $firebaseAuth,
        email,
        password,
      );
      await sendEmailVerification(cred.user);
      user.value = cred.user;
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    if (!$firebaseAuth) return;
    useForumSession().clear();
    error.value = null;
    await signOut($firebaseAuth);
    const { clearSession } = useForumApi();
    const result = await clearSession();
    if (result) {
      user.value = null;
    }
  }

  async function getIdToken(forceRefresh = false): Promise<string | null> {
    if (!$firebaseAuth || !user.value) return null;
    return user.value.getIdToken(forceRefresh);
  }

  async function resetPassword(email: string) {
    if (!$firebaseAuth) {
      error.value = "Firebase not configured";
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      await sendPasswordResetEmail($firebaseAuth, email);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
    } finally {
      loading.value = false;
    }
  }

  async function refreshUser() {
    if (!$firebaseAuth || !user.value) return;
    try {
      await reload(user.value);
      const currentUser = $firebaseAuth.currentUser;
      user.value = null;
      await nextTick();
      user.value = currentUser;
      if (currentUser?.emailVerified) {
        const { fetchMe } = useForumApi();
        await fetchMe().catch(() => {});
      }
    } catch {
      // Ignore reload errors (e.g. network)
    }
  }

  async function resendVerificationEmail() {
    if (!$firebaseAuth || !user.value) {
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
      await sendEmailVerification(user.value);
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e);
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
    getIdToken,
    resetPassword,
    refreshUser,
    resendVerificationEmail,
  };
}
