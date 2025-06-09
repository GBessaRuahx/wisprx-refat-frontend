import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';

export interface ContactListItemPayload {
  id?: number;
  [key: string]: unknown;
}

export interface ContactListItem {
  id: number;
  name: string;
  number: string;
  [key: string]: unknown;
}

export function useContactListItems() {
  const findAll = async (
    params?: Record<string, unknown>
  ): Promise<ContactListItem[]> => {
    try {
      const { data } = await api.request<ContactListItem[]>({
        url: '/contact-list-items',
        method: 'GET',
        params,
      });
      return data;
    } catch (err) {
      toastError(err);
      return [];
    }
  };

  const save = async (data: ContactListItemPayload): Promise<ContactListItem> => {
    const { data: responseData } = await api.request<ContactListItem>({
      url: '/contact-list-items',
      method: 'POST',
      data,
    });
    return responseData;
  };

  const update = async (
    data: ContactListItemPayload & { id: number }
  ): Promise<ContactListItem> => {
    const { data: responseData } = await api.request<ContactListItem>({
      url: `/contact-list-items/${data.id}`,
      method: 'PUT',
      data,
    });
    return responseData;
  };

  const deleteRecord = async (id: number): Promise<unknown> => {
    const { data } = await api.request({
      url: `/contact-list-items/${id}`,
      method: 'DELETE',
    });
    return data;
  };

  const list = async (
    params?: Record<string, unknown>
  ): Promise<ContactListItem[]> => {
    try {
      const { data } = await api.request<ContactListItem[]>({
        url: '/contact-list-items/list',
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
    save,
    update,
    deleteRecord,
    list,
    findAll,
  };
}

export default useContactListItems;
