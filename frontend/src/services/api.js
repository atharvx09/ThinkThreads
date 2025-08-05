import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const chatAPI = {
  sendMessage: async (message, conversationId = null, userId = null) => {
    const response = await api.post('/chat', {
      message,
      conversation_id: conversationId,
      user_id: userId
    });
    return response.data;
  },

  getConversations: async (userId = null) => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get('/conversations', { params });
    return response.data;
  },

  getConversationMessages: async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  }
};

export default api;