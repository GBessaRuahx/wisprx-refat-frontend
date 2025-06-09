export interface Message {
  id: string;
  ticketId: number;
  contactId?: number;
  body: string;
  fromMe: boolean;
  mediaUrl?: string | null;
  mediaType?: string | null;
  quotedMsg?: Message | null;
  isDeleted?: boolean;
  isEdited?: boolean;
  createdAt: string;
  updatedAt: string;
  contact?: {
    id: number;
    name: string;
  };
}

export default Message;
