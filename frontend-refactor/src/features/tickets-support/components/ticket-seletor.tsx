'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useTicketsStore } from '@/features/tickets-support/stores/tickets.store';

export function TicketRedirectHandler() {
  const router = useRouter();
  const { currentTicket } = useTicketsStore();

  useEffect(() => {
    if (currentTicket?.id && currentTicket?.uuid) {
      router.push(`/tickets/${currentTicket.uuid}`);
    }
  }, [currentTicket, router]);

  return null;
}