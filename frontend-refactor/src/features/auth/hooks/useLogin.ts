import { useState } from 'react';
import { useRouter } from 'next/router';
import { login, LoginPayload } from '../services/authService';
import { useAuthStore } from '../stores/useAuthStore';

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
