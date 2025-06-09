import { useEffect, useState } from 'react';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';
import Ticket from '@entities/Ticket';

export interface UseTicketsParams {
  searchParam?: string;
  tags?: string;
  users?: string;
  pageNumber?: number;
  status?: string;
  date?: string;
  updatedAt?: string;
  showAll?: string;
  queueIds?: string;
  withUnreadMessages?: string;
}

export interface UseTicketsResult {
  tickets: Ticket[];
  loading: boolean;
  hasMore: boolean;
}

export function useTickets({
  searchParam,
  tags,
  users,
  pageNumber,
  status,
  date,
  updatedAt,
  showAll,
  queueIds,
  withUnreadMessages,
}: UseTicketsParams): UseTicketsResult {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchTickets = async () => {
        try {
          const { data } = await api.get<{
            tickets: Ticket[];
            hasMore: boolean;
          }>('/tickets', {
            params: {
              searchParam,
              pageNumber,
              tags,
              users,
              status,
              date,
              updatedAt,
              showAll,
              queueIds,
              withUnreadMessages,
            },
          });
          setTickets(data.tickets);
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };
      fetchTickets();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [
    searchParam,
    tags,
    users,
    pageNumber,
    status,
    date,
    updatedAt,
    showAll,
    queueIds,
    withUnreadMessages,
  ]);

  return { tickets, loading, hasMore };
}

export default useTickets;
