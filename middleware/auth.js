import { useAuthStore } from "@/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (import.meta.server) {
    // On server-side, we can't access localStorage, so we skip the check
    return;
  }

  // On client-side, we initialize the auth state before checking
  authStore.initializeAuth();

  if (!authStore.isAuthenticated && to.path !== '/') {
    return navigateTo('/');
  }
});