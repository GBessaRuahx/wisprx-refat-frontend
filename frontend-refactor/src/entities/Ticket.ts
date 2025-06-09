export interface Ticket {
  id: number;
  status: string;
  unreadMessages: number;
  userId: number | null;
  queueId: number | null;
  contactId: number;
  companyId: number;
}

export default Ticket;
