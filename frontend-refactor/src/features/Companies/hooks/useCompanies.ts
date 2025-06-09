import api from '@shared/services/api';

export interface CompanyPayload extends Record<string, unknown> {
  id?: number;
}

export interface Company extends CompanyPayload {
  id: number;
}

export function useCompanies() {
  const save = async (payload: CompanyPayload): Promise<Company> => {
    const { data } = await api.request<Company>({
      url: '/companies',
      method: 'POST',
      data: payload,
    });
    return data;
  };

  const findAll = async (): Promise<Company[]> => {
    const { data } = await api.request<Company[]>({
      url: '/companies',
      method: 'GET',
    });
    return data;
  };

  const list = async (): Promise<Company[]> => {
    const { data } = await api.request<Company[]>({
      url: '/companies/list',
      method: 'GET',
    });
    return data;
  };

  const find = async (id: number): Promise<Company> => {
    const { data } = await api.request<Company>({
      url: `/companies/${id}`,
      method: 'GET',
    });
    return data;
  };

  const update = async (payload: CompanyPayload & { id: number }): Promise<Company> => {
    const { data } = await api.request<Company>({
      url: `/companies/${payload.id}`,
      method: 'PUT',
      data: payload,
    });
    return data;
  };

  const remove = async (id: number): Promise<unknown> => {
    const { data } = await api.request({
      url: `/companies/${id}`,
      method: 'DELETE',
    });
    return data;
  };

  const updateSchedules = async (
    payload: CompanyPayload & { id: number }
  ): Promise<Company> => {
    const { data } = await api.request<Company>({
      url: `/companies/${payload.id}/schedules`,
      method: 'PUT',
      data: payload,
    });
    return data;
  };

  return {
    save,
    update,
    remove,
    list,
    find,
    findAll,
    updateSchedules,
  };
}

export default useCompanies;
