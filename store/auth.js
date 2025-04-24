import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token, // Checks if the token exists
  },
  actions: {
    setAuthData(token, user) {
      this.token = token;
      this.user = user;

      // Store the token in localStorage only if on the client-side
      if (import.meta.client) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    logout() {
      this.token = null;
      this.user = null;

      // Remove token from localStorage only if on the client-side
      if (import.meta.client) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    initializeAuth() {
      // Initialize the store based on the token in localStorage (only on client-side)
      if (import.meta.client) {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken) {
          this.token = storedToken;
          // Optionally, you can also fetch user data based on the token
        }
        if (storedUser) {
          this.user = storedUser;
          // Optionally, you can also fetch user data based on the token
        }
      }
    }
  }
});
