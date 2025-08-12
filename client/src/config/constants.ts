export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    VERIFY: '/api/auth/verify',
  },
  TICKETS: {
    PURCHASE: '/api/tickets/purchase',
    GET: (id: string) => `/api/tickets/${id}`,
    REVEAL: (id: string) => `/api/tickets/${id}/reveal`,
  },
  STATS: '/api/stats',
  GAMEBOX: {
    CURRENT: '/api/gamebox/current',
  },
  USER: {
    PROFILE: '/api/user/profile',
  },
};