export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const ETHEREUM_RPC_URL = import.meta.env.VITE_ETHEREUM_RPC_URL || 'http://localhost:8545';
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  INSTITUTION: '/institution',
  STUDENT: '/student',
  VERIFIER: '/verifier',
  PORTFOLIO: '/portfolio/:studentId',
} as const;
