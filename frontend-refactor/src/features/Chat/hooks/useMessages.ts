import { useState, useEffect, useReducer, useRef, useContext } from 'react';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';
import Message from '@entities/Message';
import Ticket from '@entities/Ticket';
import { SocketContext } from '../../../../../frontend/src/context/Socket/SocketContext';

export interface UseMessagesParams {
  ticket?: Ticket;
  ticketId?: number;
}

export interface UseMessagesResult {
  messages: Message[];
  sendMessage: (data: FormData | { body: string; quotedMsg?: Message | null }) => Promise<void>;
  loading: boolean;
  hasMore: boolean;
  scrollToBottom: () => void;
  handleScroll: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  lastMessageRef: React.RefObject<HTMLDivElement>;
}

type Action =
  | { type: 'LOAD_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'RESET' };

const reducer = (state: Message[], action: Action): Message[] => {
  switch (action.type) {
    case 'LOAD_MESSAGES': {
      const messages = action.payload;
      const newMessages: Message[] = [];
      const updated = [...state];
      messages.forEach(message => {
        const index = updated.findIndex(m => m.id === message.id);
        if (index !== -1) {
          updated[index] = message;
        } else {
          newMessages.push(message);
        }
      });
      return [...newMessages, ...updated];
    }
    case 'ADD_MESSAGE': {
      const msg = action.payload;
      const index = state.findIndex(m => m.id === msg.id);
      if (index !== -1) {
        const updated = [...state];
        updated[index] = msg;
        return updated;
      }
      return [...state, msg];
    }
    case 'UPDATE_MESSAGE': {
      const msg = action.payload;
      const updated = state.map(m => (m.id === msg.id ? msg : m));
      return updated;
    }
    case 'RESET':
      return [];
    default:
      return state;
  }
};

export function useMessages({ ticket, ticketId }: UseMessagesParams): UseMessagesResult {
  const [messages, dispatch] = useReducer(reducer, [] as Message[]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const currentTicketId = useRef<number | undefined>(ticketId);

  // SocketContext is still typed in JavaScript in the legacy code
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socketManager = useContext<any>(SocketContext);

  useEffect(() => {
    dispatch({ type: 'RESET' });
    setPageNumber(1);
    currentTicketId.current = ticketId;
  }, [ticketId]);

  useEffect(() => {
    setLoading(true);
    const delay = setTimeout(() => {
      const fetchMessages = async () => {
        if (ticketId === undefined) return;
        try {
          const { data } = await api.get<{ messages: Message[]; hasMore: boolean }>(
            `/messages/${ticketId}`,
            {
              params: { pageNumber },
            },
          );
          if (currentTicketId.current === ticketId) {
            dispatch({ type: 'LOAD_MESSAGES', payload: data.messages });
            setHasMore(data.hasMore);
          }
        } catch (err) {
          toastError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMessages();
    }, 500);
    return () => clearTimeout(delay);
  }, [pageNumber, ticketId]);

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    const socket = socketManager.getSocket(companyId);

    if (ticket) {
      socket.on('ready', () => socket.emit('joinChatBox', `${ticket.id}`));
    }

    socket.on(`company-${companyId}-appMessage`, data => {
      if (data.action === 'create' && data.message.ticketId === currentTicketId.current) {
        dispatch({ type: 'ADD_MESSAGE', payload: data.message });
        scrollToBottom();
      }

      if (data.action === 'update' && data.message.ticketId === currentTicketId.current) {
        dispatch({ type: 'UPDATE_MESSAGE', payload: data.message });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId, ticket, socketManager]);

  const loadMore = () => {
    setPageNumber(prev => prev + 1);
  };

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({});
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (!hasMore) return;
    const { scrollTop } = e.currentTarget;

    if (scrollTop === 0) {
      (e.currentTarget as HTMLDivElement).scrollTop = 1;
    }

    if (loading) {
      return;
    }

    if (scrollTop < 50) {
      loadMore();
    }
  };

  const sendMessage = async (payload: FormData | { body: string; quotedMsg?: Message | null }) => {
    if (ticketId === undefined) return;
    try {
      await api.post(`/messages/${ticketId}`, payload);
    } catch (err) {
      toastError(err);
    }
  };

  return {
    messages,
    sendMessage,
    loading,
    hasMore,
    scrollToBottom,
    handleScroll,
    lastMessageRef,
  };
}

export default useMessages;
