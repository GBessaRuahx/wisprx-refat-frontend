import { api, openApi } from '../../../shared/services/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post('/auth/login', payload);
  return data as { token: string; user: any };
}

export interface SignUpPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  planId: string;
}

export async function signUp(payload: SignUpPayload) {
  const { data } = await openApi.post('/companies/cadastro', payload);
  return data;
}
