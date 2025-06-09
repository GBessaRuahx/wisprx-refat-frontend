import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';

export interface ContactListPayload {
  id?: number;
  [key: string]: unknown;
}

export interface ContactList {
  id: number;
  name: string;
  [key: string]: unknown;
}

export function useContactLists() {
  const save = async (data: ContactListPayload): Promise<ContactList> => {
    const { data: responseData } = await api.request<ContactList>({
      url: '/contact-lists',
      method: 'POST',
      data,
    });
    return responseData;
  };

  const update = async (data: ContactListPayload & { id: number }): Promise<ContactList> => {
    const { data: responseData } = await api.request<ContactList>({
      url: `/contact-lists/${data.id}`,
      method: 'PUT',
      data,
    });
    return responseData;
  };

  const deleteRecord = async (id: number): Promise<unknown> => {
    const { data } = await api.request({
      url: `/contact-lists/${id}`,
      method: 'DELETE',
    });
    return data;
  };

  const findById = async (id: number): Promise<ContactList> => {
    const { data } = await api.request<ContactList>({
      url: `/contact-lists/${id}`,
      method: 'GET',
    });
    return data;
  };

  const list = async (params?: Record<string, unknown>): Promise<ContactList[]> => {
    try {
      const { data } = await api.request<ContactList[]>({
        url: '/contact-lists/list',
        method: 'GET',
        params,
      });
      return data;
    } catch (err) {
      toastError(err);
      return [];
    }
  };

  return {
    findById,
    save,
    update,
    deleteRecord,
    list,
  };
}

export default useContactLists;
