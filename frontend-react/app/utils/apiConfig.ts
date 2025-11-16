/**
 * API Configuration
 * Uses environment variable for production, falls back to localhost for development
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  upload: `${API_URL}/api/upload`,
  query: `${API_URL}/api/query`,
  files: `${API_URL}/api/files`,
  delete: (filename: string) => `${API_URL}/api/delete/${encodeURIComponent(filename)}`,
  rename: `${API_URL}/api/rename`,
  download: (filename: string) => `${API_URL}/api/download/${encodeURIComponent(filename)}`,
  health: `${API_URL}/api/health`,
};

