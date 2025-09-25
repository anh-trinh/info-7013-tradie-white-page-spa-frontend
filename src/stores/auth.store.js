import { defineStore } from 'pinia';

// Helper functions to get token/user from both localStorage and sessionStorage
const getStoredToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
};

const getStoredUser = () => {
  const userFromLocal = localStorage.getItem('user');
  const userFromSession = sessionStorage.getItem('user');
  const userData = userFromLocal || userFromSession;
  return userData ? JSON.parse(userData) : null;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: getStoredUser(),
    token: getStoredToken(),
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    getUser: (state) => state.user,
  },
  actions: {
    logout() {
      this.user = null;
      this.token = null;
      // Clear from both storage locations
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      window.location.href = '/';
    },
    updateUser(partial) {
      // Merge and persist user updates so UI (header) reflects changes immediately
      const current = this.user || {};
      this.user = { ...current, ...partial };
      try {
        const serialized = JSON.stringify(this.user);
        localStorage.setItem('user', serialized);
        sessionStorage.setItem('user', serialized);
      } catch (e) {
        // Non-fatal if storage fails
        console.warn('Failed to persist updated user to storage', e);
      }
    }
  }
});
