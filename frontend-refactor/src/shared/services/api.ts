import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export const openApi: AxiosInstance = axios.create({
  baseURL,
});

export default api;
