import { io } from 'socket.io-client';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const socketConnection = (token, companyId) => {
  const socket = io(baseURL, {
    transports: ['websocket'],
    query: { token, companyId },
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export default socketConnection;
