import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  try {
    const rawUser = localStorage.getItem('userInfo');
    if (rawUser) {
      const userInfo = JSON.parse(rawUser);
      if (userInfo?.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    }
  } catch (e) {
    console.error('Error reading userInfo from localStorage in api interceptor', e);
  }
  return config;
});

export default api;
