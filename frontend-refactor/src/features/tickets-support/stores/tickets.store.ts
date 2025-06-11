'use client';

import { create } from 'zustand';

interface Ticket {
  id: string | null;
  code: string | null;
  uuid?: string;
}

interface TicketsStore {
  currentTicket: Ticket | null;
  setCurrentTicket: (ticket: Ticket | null) => void;
}

export const useTicketsStore = create<TicketsStore>((set) => ({
  currentTicket: null,
  setCurrentTicket: (ticket) => {
    set({ currentTicket: ticket });
  },
}));