/**
 * Centralized configuration for the PulseOps Frontend.
 * Ensures consistent environment handling between local and production.
 */

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  
  if (!url) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ CRITICAL: NEXT_PUBLIC_API_URL is missing in production!');
    }
    // Fallback for development if .env is missing
    return 'http://localhost:3001/api';
  }

  // Ensure no trailing slash for consistency
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const getSocketUrl = () => {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  
  if (!url) {
    // Standard fallback logic: if API URL has /api, socket is usually the base
    const apiUrl = getApiUrl();
    if (apiUrl.includes('/api')) {
      return apiUrl.replace('/api', '');
    }
    return 'http://localhost:3001';
  }

  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const CONFIG = {
  API_URL: getApiUrl(),
  SOCKET_URL: getSocketUrl(),
  IS_PROD: process.env.NODE_ENV === 'production',
  VERSION: '1.0.0-prod',
};

// Debug log for production initialization
if (typeof window !== 'undefined') {
  console.log('🛡️ PulseOps Config Initialized:', {
    apiUrl: CONFIG.API_URL,
    socketUrl: CONFIG.SOCKET_URL,
    mode: process.env.NODE_ENV,
  });
}
