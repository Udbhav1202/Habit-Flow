// API Configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: `${API_BASE_URL}/api/users/login`,
  SIGNUP: `${API_BASE_URL}/api/users/signup`,
  PROFILE: `${API_BASE_URL}/api/users/profile`,
  
  // Task endpoints
  TASKS: `${API_BASE_URL}/api/tasks`,
  TASK_BY_ID: (id) => `${API_BASE_URL}/api/tasks/${id}`,
  
  // Reward endpoints
  REWARDS: `${API_BASE_URL}/api/rewards`,
  REWARD_BY_ID: (id) => `${API_BASE_URL}/api/rewards/${id}`,
};

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...apiConfig.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
};
