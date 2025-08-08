import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  hasPaymentMethod: boolean;
}

export interface AuthState {
  user: User | null;
  mode: 'guest' | 'user' | null;
  pendingRoute: { routeName: string; params?: any } | null;
  isLoading: boolean;
}

export interface AuthActions {
  signIn: (user: User) => void;
  signUp: (user: User) => void;
  signOut: () => void;
  setGuestMode: () => void;
  upgradeFromGuest: (user: User) => void;
  setPendingRoute: (routeName: string, params?: any) => void;
  clearPendingRoute: () => void;
  setLoading: (loading: boolean) => void;
}

export type AuthStore = AuthState & AuthActions;

// Store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      mode: null, // Start with no mode to show landing page
      pendingRoute: null,
      isLoading: true, // Start with loading true until hydrated

      // Actions
      signIn: (user: User) => {
        set({ user, mode: 'user', pendingRoute: null, isLoading: false });
      },

      signUp: (user: User) => {
        set({ user, mode: 'user', pendingRoute: null, isLoading: false });
      },

      signOut: () => {
        set({ user: null, mode: 'guest', pendingRoute: null, isLoading: false });
      },

      setGuestMode: () => {
        set({ user: null, mode: 'guest', pendingRoute: null, isLoading: false });
      },

      upgradeFromGuest: (user: User) => {
        set({ user, mode: 'user', pendingRoute: null, isLoading: false });
      },

      setPendingRoute: (routeName: string, params?: any) => {
        set({ pendingRoute: { routeName, params } });
      },

      clearPendingRoute: () => {
        set({ pendingRoute: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Set loading to false once hydration is complete
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);
