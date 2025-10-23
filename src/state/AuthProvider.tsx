import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../lib/firebase';

export type AuthMode = 'auth' | 'guest';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  mode: AuthMode | null;
  logout: () => Promise<void>;
  enterGuest: () => Promise<void>;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  setPendingRoute: (routeName: string, params?: any) => void;
  pendingRoute: { routeName: string; params?: any } | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  mode: null,
  logout: async () => {},
  enterGuest: () => Promise.resolve(),
  isAuthenticated: false,
  isGuestMode: false,
  setPendingRoute: () => {},
  pendingRoute: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode | null>(null);
  const [pendingRoute, setPendingRoute] = useState<{ routeName: string; params?: any } | null>(null);

  useEffect(() => {
    console.log('✓ Setting up auth state listener');

    try {
      const authInstance = auth();
      if (!authInstance) {
        console.warn('⚠️ Firebase Auth not available - falling back to guest mode');
        setMode('guest');
        setLoading(false);
        return;
      }

      const unsubscribe = authInstance.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          setMode('auth');
          console.log('✓ User authenticated:', firebaseUser.email);
        } else {
          // Check if user is in guest mode
          const guestMode = await AsyncStorage.getItem('guestMode');
          if (guestMode === 'true') {
            setMode('guest');
            console.log('✓ Guest mode active');
          } else {
            setMode(null);
            console.log('✓ No user, no guest mode');
          }
          setUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Error setting up auth listener:', error);
      console.warn('⚠️ Firebase Auth not available - falling back to guest mode');
      setMode('guest');
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      if (mode === 'auth' && user) {
        const authInstance = auth();
        if (authInstance) {
          await authInstance.signOut();
          console.log('✓ User logged out');
        }
      }
      await AsyncStorage.removeItem('guestMode');
      setUser(null);
      setMode(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const enterGuest = async () => {
    try {
      await AsyncStorage.setItem('guestMode', 'true');
      setMode('guest');
      setUser(null);
      console.log('✓ Entered guest mode');
    } catch (error) {
      console.error('Error entering guest mode:', error);
    }
  };

  const setPendingRouteHandler = (routeName: string, params?: any) => {
    setPendingRoute({ routeName, params });
  };

  const value = {
    user,
    loading,
    mode,
    logout,
    enterGuest,
    isAuthenticated: !!user && mode === 'auth',
    isGuestMode: mode === 'guest',
    setPendingRoute: setPendingRouteHandler,
    pendingRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
