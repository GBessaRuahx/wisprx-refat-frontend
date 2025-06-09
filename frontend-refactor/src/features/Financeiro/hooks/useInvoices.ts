import api, { openApi } from '@shared/services/api';

export interface InvoicePayload {
  id?: number;
  [key: string]: unknown;
}

export interface Invoice extends InvoicePayload {
  id: number;
}

export function useInvoices() {
  const getInvoicesList = async (
    params?: Record<string, unknown>
  ): Promise<Invoice[]> => {
    const { data } = await openApi.request<Invoice[]>({
      url: '/invoices/list',
      method: 'GET',
      params,
    });
    return data;
  };

  const list = async (params?: Record<string, unknown>): Promise<Invoice[]> => {
    const { data } = await api.request<Invoice[]>({
      url: '/invoices/all',
      method: 'GET',
      params,
    });
    return data;
  };

  const save = async (payload: InvoicePayload): Promise<Invoice> => {
    const { data } = await api.request<Invoice>({
      url: '/invoices',
      method: 'POST',
      data: payload,
    });
    return data;
  };

  const show = async (id: number): Promise<Invoice> => {
    const { data } = await api.request<Invoice>({
      url: `/invoices/${id}`,
      method: 'GET',
    });
    return data;
  };

  const update = async (
    payload: InvoicePayload & { id: number }
  ): Promise<Invoice> => {
    const { data } = await api.request<Invoice>({
      url: `/invoices/${payload.id}`,
      method: 'PUT',
      data: payload,
    });
    return data;
  };

  const remove = async (id: number): Promise<unknown> => {
    const { data } = await api.request({
      url: `/invoices/${id}`,
      method: 'DELETE',
    });
    return data;
  };

  return { getInvoicesList, list, save, show, update, remove };
}

export default useInvoices;
