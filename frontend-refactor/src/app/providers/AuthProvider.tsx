import React, { createContext, ReactNode, useContext } from 'react';
import useAuthHook from '@features/login/hooks/useAuth';
import User from '@entities/User';

interface AuthContextValue {
  user: User | null;
  isAuth: boolean;
  loading: boolean;
  handleLogin: (data: { email: string; password: string }) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuth, loading, handleLogin, handleLogout } = useAuthHook();

  return (
    <AuthContext.Provider
      value={{ user, isAuth, loading, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

