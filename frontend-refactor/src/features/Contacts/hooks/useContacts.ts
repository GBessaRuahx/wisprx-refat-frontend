import { useEffect, useState } from 'react';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';

export interface UseContactsParams {
  searchParam?: string;
  pageNumber?: number;
  date?: string;
  dateStart?: string;
  dateEnd?: string;
}

export interface Contact {
  id: number;
  name: string;
  number: string;
  [key: string]: unknown;
}

export interface UseContactsResult {
  contacts: Contact[];
  loading: boolean;
  hasMore: boolean;
  count: number;
}

export function useContacts({
  searchParam,
  pageNumber,
  date,
  dateStart,
  dateEnd,
}: UseContactsParams): UseContactsResult {
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchContacts = async () => {
        try {
          const { data } = await api.get<{
            contacts: Contact[];
            hasMore: boolean;
            count: number;
          }>('/contacts', {
            params: {
              searchParam,
              pageNumber,
              date,
              dateStart,
              dateEnd,
            },
          });
          setContacts(data.contacts);
          setHasMore(data.hasMore);
          setCount(data.count);
          setLoading(false);
        } catch (err) {
          setLoading(false);
          toastError(err);
        }
      };

      fetchContacts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber, date, dateStart, dateEnd]);

  return { contacts, loading, hasMore, count };
}

export default useContacts;
