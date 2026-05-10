import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || '';


export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  timeout: 10000,
});

// Production logging for connection status
if (typeof window !== 'undefined') {
  socket.on('connect', () => console.log('🟢 WebSocket Connected'));
  socket.on('disconnect', () => console.log('🔴 WebSocket Disconnected'));
  socket.on('connect_error', (error) => console.error('🟠 WebSocket Error:', error));
}

