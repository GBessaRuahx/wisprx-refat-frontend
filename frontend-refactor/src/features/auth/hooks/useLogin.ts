import { useState } from 'react';
import { useRouter } from 'next/router';
import { login, LoginPayload } from '@features/auth/services/authService';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setToken = useAuthStore(state => state.setToken);

  const handleLogin = async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const data = await login(payload);
      setToken(data.token);
      router.push('/tickets');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading };
}
