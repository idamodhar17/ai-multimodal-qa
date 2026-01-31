const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,
  UPLOAD: `${API_BASE}/upload/`,
  PROCESS: (fileId) => `${API_BASE}/process/${fileId}`,
  CHAT: `${API_BASE}/chat/`,
};

export default API_ENDPOINTS;
