import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints (ready to connect to real backend)
export const authService = {
  login: async (email, password) => {
    // Replace with real API call when backend is ready
    // const response = await api.post('/auth/login', { email, password });
    // return response.data;
    
    // Mock implementation for now
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const user = { id: '1', email };
          const token = 'mock_token_' + Date.now();
          resolve({ user, token });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  },

  signup: async (email, password) => {
    // Replace with real API call when backend is ready
    // const response = await api.post('/auth/signup', { email, password });
    // return response.data;
    
    // Mock implementation for now
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6) {
          const user = { id: '1', email };
          const token = 'mock_token_' + Date.now();
          resolve({ user, token });
        } else {
          reject(new Error('Password must be at least 6 characters'));
        }
      }, 800);
    });
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};

// File upload
export const uploadFile = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
};

// Get summary
export const getSummary = async (fileId) => {
  const response = await api.get(`/summary/${fileId}`);
  return response.data;
};

// Chat with AI
export const sendChatMessage = async (fileId, message) => {
  const response = await api.post('/chat', { file_id: fileId, message });
  return response.data;
};

export default api;
