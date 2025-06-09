import api from '@shared/services/api';

export interface HelpPayload {
  id?: number;
  title?: string;
  description?: string;
  video?: string;
  [key: string]: unknown;
}

export interface Help extends HelpPayload {
  id: number;
}

export function useHelps() {
  const findAll = async (params?: Record<string, unknown>): Promise<Help[]> => {
    const { data } = await api.request<Help[]>({
      url: '/helps',
      method: 'GET',
      params,
    });
    return data;
  };

  const list = async (params?: Record<string, unknown>): Promise<Help[]> => {
    const { data } = await api.request<Help[]>({
      url: '/helps/list',
      method: 'GET',
      params,
    });
    return data;
  };

  const save = async (payload: HelpPayload): Promise<Help> => {
    const { data } = await api.request<Help>({
      url: '/helps',
      method: 'POST',
      data: payload,
    });
    return data;
  };

  const update = async (payload: HelpPayload & { id: number }): Promise<Help> => {
    const { data } = await api.request<Help>({
      url: `/helps/${payload.id}`,
      method: 'PUT',
      data: payload,
    });
    return data;
  };

  const remove = async (id: number): Promise<unknown> => {
    const { data } = await api.request({
      url: `/helps/${id}`,
      method: 'DELETE',
    });
    return data;
  };

  return { findAll, list, save, update, remove };
}

export default useHelps;
