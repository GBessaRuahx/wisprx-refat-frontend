import { createContext, ReactNode, useContext } from 'react';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { token, setToken } = useAuthStore();
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
