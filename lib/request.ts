import { LOCAL_STORAGE_TOKEN_KEY } from "@/features/auth/constants";
import axios from "axios";

export type TResponse<T> = {
  data: T;
  code: number;
  msg: string;
};

export type TListResponse<T> = {
  data: { list: T };
  code: number;
  msg: string;
};

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

request.interceptors.request.use((config) => {
  // if (typeof window !== "undefined") {
  //   const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
  //   console.log("token", token);
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  //   }
  // }

  let locale;
  let token;

  if (typeof window !== "undefined") {
    // 客户端获取 cookie
    locale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];
    token = document.cookie
      .split("; ")
      .find((row) => row.startsWith(LOCAL_STORAGE_TOKEN_KEY))
      ?.split("=")[1];
  } else {
    // 服务端获取 cookie
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cookies } = require('next/headers');
    try {
      locale = cookies().get('NEXT_LOCALE')?.value;
      token = cookies().get(LOCAL_STORAGE_TOKEN_KEY)?.value;
    } catch (error) {
      console.warn('Unable to access cookies on server side:', error);
    }
  }

  config.headers.language = locale;
  config.headers.Authorization = token ? `Bearer ${token}` : undefined;
  return config;
});

export default request;
