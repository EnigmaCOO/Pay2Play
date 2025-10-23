
import axios from 'axios';
import Constants from 'expo-constants';

// Use your Replit deployment URL or local IP for development
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://YOUR_REPL_URL.replit.dev';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  get: async (url: string) => {
    const response = await apiClient.get(url);
    return response.data;
  },
  post: async (url: string, data: any) => {
    const response = await apiClient.post(url, data);
    return response.data;
  },
  put: async (url: string, data: any) => {
    const response = await apiClient.put(url, data);
    return response.data;
  },
  delete: async (url: string) => {
    const response = await apiClient.delete(url);
    return response.data;
  },
};
