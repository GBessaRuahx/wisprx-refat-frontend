export interface Ticket {
  id: number;
  status: string;
  unreadMessages: number;
  userId: number | null;
  queueId: number | null;
  contactId: number;
  companyId: number;
  lastMessage?: string;
  updatedAt?: string;
  queue?: {
    id: number;
    name: string;
    color?: string;
  } | null;
  user?: {
    id: number;
    name: string;
  } | null;
  contact?: {
    id: number;
    name: string;
  } | null;
}

export default Ticket;
