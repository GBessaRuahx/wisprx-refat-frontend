export interface Whatsapp {
  id: number;
  name: string;
  status: string;
  qrcode?: string;
  updatedAt: string;
  retries: number;
}

export default Whatsapp;
