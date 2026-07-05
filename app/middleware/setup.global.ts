import { isOnboardingComplete, postAuthPath } from "~/types/user";

const AUTH_ONLY_PATHS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
]);

export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  const isAuthRoute = to.path.startsWith("/auth");
  const isOnboardRoute = to.path === "/onboard";
  const isHomeRoute = to.path.startsWith("/home");
  const isProtectedRoute = isOnboardRoute || isHomeRoute;

  if (!user.value) {
    if (isProtectedRoute) {
      return navigateTo("/auth/login");
    }
    return;
  }

  const { profile, refreshProfile } = useUserProfile();
  await refreshProfile(true);

  const userProfile = profile.value?.profile ?? null;
  const completed = isOnboardingComplete(userProfile);

  if (completed && isOnboardRoute) {
    return navigateTo("/home");
  }

  if (!completed && isHomeRoute) {
    return navigateTo("/onboard");
  }

  if (
    completed &&
    isAuthRoute &&
    AUTH_ONLY_PATHS.has(to.path)
  ) {
    return navigateTo("/home");
  }

  if (
    !completed &&
    to.path === "/auth" &&
    !isOnboardRoute
  ) {
    return navigateTo(postAuthPath(userProfile));
  }
});
