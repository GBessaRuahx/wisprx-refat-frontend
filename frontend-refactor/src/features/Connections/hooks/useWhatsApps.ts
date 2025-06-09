import { useState, useEffect, useReducer, useContext } from 'react';
import api from '@shared/services/api';
import toastError from '@shared/utils/toastError';
import Whatsapp from '@entities/Whatsapp';
// SocketContext still resides in the legacy frontend folder
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { SocketContext } from '../../../../../frontend/src/context/Socket/SocketContext';
type SocketContextInterface = any;

interface WhatsappSession {
  id: number;
  status: string;
  qrcode: string;
  retries: number;
  updatedAt: string;
}

type Action =
  | { type: 'LOAD_WHATSAPPS'; payload: Whatsapp[] }
  | { type: 'UPDATE_WHATSAPPS'; payload: Whatsapp }
  | { type: 'UPDATE_SESSION'; payload: WhatsappSession }
  | { type: 'DELETE_WHATSAPPS'; payload: number }
  | { type: 'RESET' };

const reducer = (state: Whatsapp[], action: Action): Whatsapp[] => {
  switch (action.type) {
    case 'LOAD_WHATSAPPS':
      return [...action.payload];
    case 'UPDATE_WHATSAPPS': {
      const whatsApp = action.payload;
      const index = state.findIndex(s => s.id === whatsApp.id);
      if (index !== -1) {
        const updated = [...state];
        updated[index] = whatsApp;
        return updated;
      }
      return [whatsApp, ...state];
    }
    case 'UPDATE_SESSION': {
      const session = action.payload;
      const index = state.findIndex(s => s.id === session.id);
      if (index !== -1) {
        const updated = [...state];
        updated[index] = {
          ...updated[index],
          status: session.status,
          updatedAt: session.updatedAt,
          qrcode: session.qrcode,
          retries: session.retries,
        };
        return updated;
      }
      return state;
    }
    case 'DELETE_WHATSAPPS': {
      const id = action.payload;
      return state.filter(w => w.id !== id);
    }
    case 'RESET':
      return [];
    default:
      return state;
  }
};

export interface UseWhatsAppsResult {
  whatsApps: Whatsapp[];
  loading: boolean;
  selectedConnection: Whatsapp | null;
  setSelectedConnection: React.Dispatch<React.SetStateAction<Whatsapp | null>>;
  startSession: (id: number) => Promise<void>;
  requestNewQrCode: (id: number) => Promise<void>;
  disconnect: (id: number) => Promise<void>;
  deleteConnection: (id: number) => Promise<void>;
  reloadConnections: () => Promise<void>;
}

export function useWhatsApps(): UseWhatsAppsResult {
  const [whatsApps, dispatch] = useReducer(reducer, [] as Whatsapp[]);
  const [loading, setLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState<Whatsapp | null>(null);

  const socketManager = useContext<SocketContextInterface>(SocketContext);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Whatsapp[]>('/whatsapp', {
        params: { session: 0 },
      });
      dispatch({ type: 'LOAD_WHATSAPPS', payload: data });
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      console.error("Company ID is missing in localStorage.");
      return;
    }
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-whatsapp`, (data: { action: string; whatsapp: Whatsapp; whatsappId: number }) => {
      if (data.action === 'update') {
        dispatch({ type: 'UPDATE_WHATSAPPS', payload: data.whatsapp });
      }
      if (data.action === 'delete') {
        dispatch({ type: 'DELETE_WHATSAPPS', payload: data.whatsappId });
      }
    });

    socket.on(`company-${companyId}-whatsappSession`, (data: { action: string; session: WhatsappSession }) => {
      if (data.action === 'update') {
        dispatch({ type: 'UPDATE_SESSION', payload: data.session });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const startSession = async (id: number) => {
    try {
      await api.post(`/whatsappsession/${id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const requestNewQrCode = async (id: number) => {
    try {
      await api.put(`/whatsappsession/${id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const disconnect = async (id: number) => {
    try {
      await api.delete(`/whatsappsession/${id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const deleteConnection = async (id: number) => {
    try {
      await api.delete(`/whatsapp/${id}`);
    } catch (err) {
      toastError(err);
    }
  };

  const reloadConnections = async () => {
    await fetchConnections();
  };

  return {
    whatsApps,
    loading,
    selectedConnection,
    setSelectedConnection,
    startSession,
    requestNewQrCode,
    disconnect,
    deleteConnection,
    reloadConnections,
  };
}

export default useWhatsApps;
