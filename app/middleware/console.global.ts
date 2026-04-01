export default defineNuxtRouteMiddleware(async (to, _) => {
  //TODO: Server-side protection with cookie configured
  if (import.meta.server) return;

  const { $firebaseAuth } = useNuxtApp();
  const { user } = useFirebaseAuth();

  if ($firebaseAuth) {
    await $firebaseAuth.authStateReady();
  }

  if (!user.value && to.path === "/onboard") {
    return navigateTo("auth/login");
  }

  if (user.value && to.path === "/auth/login") {
    return navigateTo("/onboard");
  }
});
