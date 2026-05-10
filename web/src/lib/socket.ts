import { io } from 'socket.io-client';
import { CONFIG } from './config';

/**
 * Standardized Socket.io client using centralized CONFIG.
 */
export const socket = io(CONFIG.SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  timeout: 10000,
});

// Production logging for connection status
if (typeof window !== 'undefined') {
  socket.on('connect', () => {
    console.log('🟢 WebSocket Connected to:', CONFIG.SOCKET_URL);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('🔴 WebSocket Disconnected:', reason);
  });
  
  socket.on('connect_error', (error) => {
    console.error('🟠 WebSocket Connection Error:', error.message);
  });
}
