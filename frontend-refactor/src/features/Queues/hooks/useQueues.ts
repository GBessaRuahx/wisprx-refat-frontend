import { useQuery } from '@tanstack/react-query';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';
import Queue from '@entities/Queue';

export interface UseQueuesParams {
  companyId?: number;
}

export interface UseQueuesResult {
  queues: Queue[];
  isLoading: boolean;
  error: Error | null;
  refetchQueues: () => Promise<Queue[]>;
  getQueue: (id: number) => Promise<Queue>;
}

export const DEFAULT_QUEUE: Queue = {
  id: 0,
  name: 'Default',
  color: '#7C7C7C',
};

export function useQueues(params: UseQueuesParams = {}): UseQueuesResult {
  const {
    data,
    isFetching,
    error,
    refetch,
  } = useQuery<Queue[], Error>({
    queryKey: ['queues', params],
    queryFn: async () => {
      try {
        const { data } = await api.get<Queue[]>('/queues', { params });
        return data;
      } catch (err) {
        toastError(err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const refetchQueues = async (): Promise<Queue[]> => {
    const result = await refetch();
    return result.data ?? [];
  };

  const getQueue = async (id: number): Promise<Queue> => {
    const { data } = await api.get<Queue>(`/queues/${id}`);
    return data;
  };

  const queues = data && data.length > 0 ? data : [DEFAULT_QUEUE];

  return {
    queues,
    isLoading: isFetching,
    error: error ?? null,
    refetchQueues,
    getQueue,
  };
}

export default useQueues;
