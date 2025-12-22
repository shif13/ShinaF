// ============================================
// FILE: src/store/authStore.js
// ============================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      // Login
      login: (user, accessToken, refreshToken) => {
        set({
          user,
          token: accessToken,
          refreshToken: refreshToken || null,
          isAuthenticated: true
        });

        // Store token in localStorage for API client
        localStorage.setItem('token', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        // Important: Sync cart after login
        // This will be called by the Login component after setting auth
      },

      // Logout
      logout: () => {
        // Clear all storage
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        
        // Clear auth state
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false
        });

        // Important: This will be called by components to also clear cart
      },

      // Update user info
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      // Update token (for refresh)
      updateToken: (newToken) => {
        set({ token: newToken });
        localStorage.setItem('token', newToken);
      },

      // Check if user is admin
      isAdmin: () => {
        return get().user?.role === 'ADMIN';
      }
    }),
    {
      name: 'shina-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export { useAuthStore };