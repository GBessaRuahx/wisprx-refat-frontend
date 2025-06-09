import { io } from 'socket.io-client';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const socketConnection = (token, companyId) => {
  return io(baseURL, {
    transports: ['websocket'],
    query: { token, companyId },
  });
};

export default socketConnection;
