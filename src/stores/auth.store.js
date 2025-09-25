import { defineStore } from 'pinia';

// Helper functions to get token/user from both localStorage and sessionStorage
const getStoredToken = () => {
  // Prefer normal user token; fallback to admin token
  return (
    localStorage.getItem('token') ||
    sessionStorage.getItem('token') ||
    localStorage.getItem('admin_token') ||
    sessionStorage.getItem('admin_token') ||
    null
  );
};

const getStoredUser = () => {
  // Prefer normal user; fallback to admin user
  const userFromLocal = localStorage.getItem('user') || localStorage.getItem('admin_user');
  const userFromSession = sessionStorage.getItem('user') || sessionStorage.getItem('admin_user');
  const userData = userFromLocal || userFromSession;
  try {
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.warn('Failed to parse stored user', e);
    return null;
  }
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
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('admin_token');
      sessionStorage.removeItem('admin_user');
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
