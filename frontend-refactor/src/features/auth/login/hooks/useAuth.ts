import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { has, isArray } from 'lodash';
import api from '@shared/services/api';
import { i18n } from '@shared/i18n/i18n';
import User from '@entities/User';

interface LoginPayload {
  email: string;
  password: string;
}

interface CompanySetting {
  key: string;
  value: string;
}

interface Company {
  id: number;
  dueDate: string;
  settings?: CompanySetting[];
}

interface LoginResponse {
  token: string;
  user: User & { company: Company };
}

export function useAuth() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
        setIsAuth(true);
      }
      return config;
    });
  }, []);

  useEffect(() => {
    let isRefreshing = false;
    let failedRequestsQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

    const interceptor = api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error?.response?.status === 403 && !originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({ resolve, reject });
            })
              .then((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
              })
              .catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const { data } = await api.post<LoginResponse>('/auth/refresh_token');
            if (data) {
              localStorage.setItem('token', JSON.stringify(data.token));
              api.defaults.headers.Authorization = `Bearer ${data.token}`;

              failedRequestsQueue.forEach(request => request.resolve(data.token));
              failedRequestsQueue = [];
            }
            return api(originalRequest);
          } catch (refreshError) {
            failedRequestsQueue.forEach(request => request.reject(refreshError));
            failedRequestsQueue = [];

            localStorage.removeItem('token');
            localStorage.removeItem('companyId');
            delete api.defaults.headers.Authorization;
            setIsAuth(false);

            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        if (
          error?.response?.status === 401 ||
          (error?.response?.status === 403 && originalRequest._retry)
        ) {
          localStorage.removeItem('token');
          localStorage.removeItem('companyId');
          delete api.defaults.headers.Authorization;
          setIsAuth(false);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    (async () => {
      if (token) {
        try {
          const { data } = await api.post<LoginResponse>('/auth/refresh_token');
          api.defaults.headers.Authorization = `Bearer ${data.token}`;
          setIsAuth(true);
          setUser(data.user);
        } catch (err) {
          console.error(err);
        }
      }
      setLoading(false);
    })();
  }, []);

  const handleLogin = async (userData: LoginPayload) => {
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/auth/login', userData);
      const {
        user: { companyId, id, company },
      } = data;

      if (has(company, 'settings') && isArray(company.settings)) {
        const setting = company.settings.find(s => s.key === 'campaignsEnabled');
        if (setting && setting.value === 'true') {
          localStorage.setItem('cshow', 'null');
        }
      }

      const dueDate = new Date(data.user.company.dueDate);
      const diffDays = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      if (diffDays >= 0) {
        localStorage.setItem('token', JSON.stringify(data.token));
        localStorage.setItem('companyId', String(companyId));
        localStorage.setItem('userId', String(id));
        localStorage.setItem('companyDueDate', dueDate.toLocaleDateString('pt-BR'));
        api.defaults.headers.Authorization = `Bearer ${data.token}`;
        setUser(data.user);
        setIsAuth(true);
        toast.success(i18n.t('auth.toasts.success'));
        if (diffDays < 5) {
          toast.warn(`Sua assinatura vence em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`);
        }
        router.push('/tickets');
      } else {
        toast.error(
          `Opss! Sua assinatura venceu ${dueDate.toLocaleDateString('pt-BR')}.\nEntre em contato com o Suporte para mais informações! `
        );
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao efetuar login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.delete('/auth/logout');
      setIsAuth(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('companyId');
      localStorage.removeItem('userId');
      localStorage.removeItem('cshow');
      delete api.defaults.headers.Authorization;
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao sair');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUserInfo = async (): Promise<User | null> => {
    try {
      const { data } = await api.get<User>('/auth/me');
      return data;
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Erro ao carregar usuário');
      return null;
    }
  };

  return { isAuth, user, loading, handleLogin, handleLogout, getCurrentUserInfo };
}

export default useAuth;
