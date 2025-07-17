import axios from 'axios';
import { getToken, clearAuth } from '../utils/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:10000/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response && err.response.status === 401) {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;