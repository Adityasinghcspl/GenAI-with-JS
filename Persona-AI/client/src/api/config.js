// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;