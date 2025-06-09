import { useQuery } from '@tanstack/react-query';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';
import User from '@entities/User';

export interface UsersResponse {
  users: User[];
  count: number;
  hasMore: boolean;
}

export interface UseUsersResult {
  users: User[];
  count: number;
  hasMore: boolean;
  loading: boolean;
  error: Error | null;
  refetchUsers: () => Promise<User[]>;
  getUserById: (id: number) => User | undefined;
}

export function useUsers(): UseUsersResult {
  const { data, isFetching, error, refetch } = useQuery<UsersResponse, Error>({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const { data } = await api.get<UsersResponse>('/users');
        return data;
      } catch (err) {
        toastError(err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const refetchUsers = async (): Promise<UsersResponse> => {
    try {
      const result = await refetch();
      if (!result.data) {
        throw new Error('Failed to fetch users: No data returned');
      }
      return result.data;
    } catch (err) {
      toastError(err);
      throw err;
    }
  };

  const getUserById = (id: number): User | undefined => {
    return data?.users.find(u => u.id === id);
  };

  return {
    users: data?.users ?? [],
    count: data?.count ?? 0,
    hasMore: data?.hasMore ?? false,
    loading: isFetching,
    error: error ?? null,
    refetchUsers,
    getUserById,
  };
}

export default useUsers;
