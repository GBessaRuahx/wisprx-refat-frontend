import { useCallback } from 'react';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';
import useSettingsStore, { Setting } from '../stores/useSettingsStore';

export interface UpdatePayload {
  key: string;
  value: string;
}

export interface UseSettingsResult {
  settings: Setting[];
  loading: boolean;
  error: Error | null;
  getAll: (params?: Record<string, unknown>) => Promise<Setting[]>;
  updateSetting: (payload: UpdatePayload) => Promise<Setting>;
  reloadSettings: () => Promise<void>;
  getSettingValue: (key: string) => string | undefined;
}

export function useSettings(): UseSettingsResult {
  const { settings, loading, error, setSettings, setLoading, setError } = useSettingsStore();

  const getAll = useCallback(
    async (params?: Record<string, unknown>): Promise<Setting[]> => {
      setLoading(true);
      try {
        const { data } = await api.request<Setting[]>({
          url: '/settings',
          method: 'GET',
          params,
        });
        setSettings(data);
        return data;
      } catch (err) {
        setError(err as Error);
        toastError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setSettings, setError]
  );

  const updateSetting = useCallback(
    async (payload: UpdatePayload): Promise<Setting> => {
      setLoading(true);
      try {
        const { data } = await api.request<Setting>({
          url: `/settings/${payload.key}`,
          method: 'PUT',
          data: payload,
        });
        setSettings(prev => {
          const index = prev.findIndex(s => s.key === data.key);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = data;
            return updated;
          }
          return [...prev, data];
        });
        return data;
      } catch (err) {
        setError(err as Error);
        toastError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setSettings, setError]
  );

  const reloadSettings = useCallback(async () => {
    await getAll();
  }, [getAll]);

  const getSettingValue = useCallback(
    (key: string): string | undefined => {
      const setting = settings.find(s => s.key === key);
      return setting?.value;
    },
    [settings]
  );

  return { settings, loading, error, getAll, updateSetting, reloadSettings, getSettingValue };
}

export default useSettings;
