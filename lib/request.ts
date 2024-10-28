import { LOCAL_STORAGE_TOKEN_KEY } from "@/features/auth/constants";
import axios from "axios";

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

request.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `${JSON.parse(token)}`;
  }
  return config;
});

export default request;