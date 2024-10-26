"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useLocalStorageState } from "ahooks";
import { loginWithGithubApi } from "../api/use-auth-api";
import { LOCAL_STORAGE_TOKEN_KEY } from "../constants";
import type { SetState } from "ahooks/lib/createUseStorageState";

type TProps = {
  children: React.ReactNode;
};

type TAuthUser = {
  login: string;
  avatar_url: string;
  address: string;
};

type TAuthContext = {
  isLogin: boolean;
  setIsLogin: (login: boolean) => void;
  isRegistering: boolean;
  setIsRegistering: (register: boolean) => void;
  authUser: TAuthUser | null;
  signInWithGithub: () => Promise<any>;
  setToken: (value?: SetState<null> | undefined) => void;
};

export const AuthContext = React.createContext<TAuthContext>(
  {} as TAuthContext
);

export const AuthProvider = ({ children }: TProps) => {
  const [authUser, setAuthUser] = useState<TAuthUser | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [token, setToken] = useLocalStorageState(LOCAL_STORAGE_TOKEN_KEY, {
    defaultValue: null,
  });

  const signInWithGithub = useCallback(() => {
    return new Promise((resolve, reject) => {
      const uri = window.location.href.replace(window.location.origin, "");
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/redirect?uri=${uri}`;

      // 打开新窗口
      const authWindow = window.open(
        authUrl,
        "GitHub 登录",
        "width=600,height=600"
      );

      // 创建一个只执行一次的事件处理函数
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "github-oauth") {
          console.log("github-oauth", event.data.code);

          // 关闭弹窗
          authWindow?.close();

          // 使用 code 获取 token
          const data = await loginWithGithubApi(event.data.code);
          console.log(data);

          if (data.data && data.code === 200) {
            resolve(data);
          } else {
            reject(new Error("GitHub 登录失败"));
          }

          // 移除事件监听器
          window.removeEventListener("message", handleMessage);
        }
      };

      // 添加事件监听器
      window.addEventListener("message", handleMessage, false);
    });
  }, []);

  const state = useMemo(
    () => ({
      authUser,
      isLogin,
      isRegistering,
      signInWithGithub,
      setIsRegistering,
      setIsLogin,
      setToken,
    }),
    [
      authUser,
      isLogin,
      isRegistering,
      signInWithGithub,
      setIsRegistering,
      setIsLogin,
      setToken,
    ]
  );

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
