import { useState } from 'react';
import { useRouter } from 'next/router';
import { signUp, SignUpPayload } from '../services/authService';

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (payload: SignUpPayload) => {
    setLoading(true);
    try {
      await signUp(payload);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return { handleSignUp, loading };
}
