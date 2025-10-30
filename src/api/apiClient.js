import axios from 'axios';

const isProduction = process.env.NODE_ENV === 'production';

const apiClient = axios.create({
  baseURL: isProduction ? '/' : (process.env.REACT_APP_API_URL || 'http://localhost:3001/api'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (optional: add auth, logging)
apiClient.interceptors.request.use(
  (config) => {
    // Example: add token if needed later
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network Error';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
