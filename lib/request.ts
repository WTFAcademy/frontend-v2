import { LOCAL_STORAGE_TOKEN_KEY } from "@/features/auth/constants";
import axios from "axios";

export type TRequestResponse<T> = {
  data: T;
  code: number;
  msg: string;
};

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

request.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `${JSON.parse(token)}`;
    }
  }
  const locale = typeof document !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('NEXT_LOCALE='))?.split('=')[1] : undefined;
  config.headers.lang = locale;
  return config;
});

export default request;