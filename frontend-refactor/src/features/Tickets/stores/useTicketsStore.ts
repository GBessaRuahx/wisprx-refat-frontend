import { create } from 'zustand';
import Ticket from '@entities/Ticket';

interface TicketsState {
  selectedTicket: Ticket | null;
  setSelectedTicket: (ticket: Ticket | null) => void;
}

const useTicketsStore = create<TicketsState>(set => ({
  selectedTicket: null,
  setSelectedTicket: ticket => set({ selectedTicket: ticket }),
}));

export default useTicketsStore;
