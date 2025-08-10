// Axios-based API client to talk to backend
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
const apiClient = axios.create({ baseURL: API_BASE, withCredentials: true });

// Attach Supabase session token to requests when available
import { supabase } from '../../supabase/client';
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
