import { useState } from 'react';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';

export interface QuickMessagePayload {
  id?: number;
  shortcode: string;
  message: string;
  mediaUrl?: string | null;
  mediaPath?: string | null;
  mediaName?: string | null;
  category?: string | null;
  [key: string]: unknown;
}

export interface QuickMessage extends QuickMessagePayload {
  id: number;
}

export interface ListParams {
  companyId?: number | string;
  userId?: number | string;
  [key: string]: unknown;
}

export interface UseQuickMessagesResult {
  loading: boolean;
  error: Error | null;
  save: (data: QuickMessagePayload) => Promise<QuickMessage>;
  update: (data: QuickMessagePayload & { id: number }) => Promise<QuickMessage>;
  deleteRecord: (id: number) => Promise<unknown>;
  list: (params?: ListParams) => Promise<QuickMessage[]>;
}

export function useQuickMessages(): UseQuickMessagesResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = async (data: QuickMessagePayload): Promise<QuickMessage> => {
    setLoading(true);
    try {
      const response = await api.request<QuickMessage>({
        url: '/quick-messages',
        method: 'POST',
        data,
      });
      return response.data;
    } catch (err) {
      setError(err as Error);
      toastError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (
    data: QuickMessagePayload & { id: number }
  ): Promise<QuickMessage> => {
    setLoading(true);
    try {
      const response = await api.request<QuickMessage>({
        url: `/quick-messages/${data.id}`,
        method: 'PUT',
        data,
      });
      return response.data;
    } catch (err) {
      setError(err as Error);
      toastError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: number): Promise<unknown> => {
    setLoading(true);
    try {
      const { data } = await api.request({
        url: `/quick-messages/${id}`,
        method: 'DELETE',
      });
      return data;
    } catch (err) {
      setError(err as Error);
      toastError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const list = async (params?: ListParams): Promise<QuickMessage[]> => {
    setLoading(true);
    try {
      const { data } = await api.request<QuickMessage[]>({
        url: '/quick-messages/list',
        method: 'GET',
        params,
      });
      return data;
    } catch (err) {
      setError(err as Error);
      toastError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, save, update, deleteRecord, list };
}

export default useQuickMessages;
