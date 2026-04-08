export default defineNuxtRouteMiddleware(async (to, from) => {
  const PROTECTED_ROUTE = ["/onboard"];
  if (import.meta.server) {
    const sessionCookie = useCookie("sessionId");
    if (!sessionCookie.value) {
      if (PROTECTED_ROUTE.includes(to.path)) {
        return navigateTo("auth/login");
      }
    }

    if (to.path === "auth/login") {
      return navigateTo(from.path);
    }
  }

  if (import.meta.client) {
    return;
  }
});
