import { useMemo } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';
import Ticket from '@entities/Ticket';
import useTicketsStore from '../stores/useTicketsStore';

export interface TicketFilters {
  searchParam?: string;
  tags?: string;
  users?: string;
  status?: string;
  date?: string;
  updatedAt?: string;
  showAll?: string;
  queueIds?: string;
  withUnreadMessages?: string;
}

export interface UpdateTicketPayload {
  status?: 'open' | 'pending' | 'closed';
  userId?: number | null;
  queueId?: number | null;
}

export interface UseTicketsResult {
  tickets: Ticket[];
  isLoading: boolean;
  hasMore: boolean;
  fetchNextPage: () => Promise<void>;
  updateTicket: (id: number, data: UpdateTicketPayload) => Promise<Ticket | void>;
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
}

export function useTickets(filters: TicketFilters = {}): UseTicketsResult {
  const queryClient = useQueryClient();
  const { selectedTicket, setSelectedTicket } = useTicketsStore();

  const {
    data,
    isFetching,
    fetchNextPage,
  } = useInfiniteQuery<{ tickets: Ticket[]; hasMore: boolean; page: number }, Error>({
    queryKey: ['tickets', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const page = pageParam as number;
      const { data } = await api.get<{ tickets: Ticket[]; hasMore: boolean }>('/tickets', {
        params: { ...filters, pageNumber: page },
      });
      return { tickets: data.tickets, hasMore: data.hasMore, page: page };
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTicketPayload }) => {
      const response = await api.put<Ticket>(`/tickets/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: err => toastError(err),
  });

  const tickets = useMemo(() => {
    return data?.pages.flatMap(p => p.tickets) || [];
  }, [data]);

  const hasMore = data?.pages[data.pages.length - 1]?.hasMore ?? false;

  const updateTicket = async (id: number, payload: UpdateTicketPayload) => {
    try {
      return await updateMutation.mutateAsync({ id, data: payload });
    } catch {
      return undefined;
    }
  };

  return {
    tickets,
    isLoading: isFetching,
    hasMore,
    fetchNextPage: () => fetchNextPage().then(() => undefined),
    updateTicket,
    selectedTicket,
    setSelectedTicket,
  };
}

export default useTickets;
