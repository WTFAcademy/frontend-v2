"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useCookieState } from "ahooks";
import { loginWithGithubApi } from "../api/use-auth-api";
import { LOCAL_STORAGE_TOKEN_KEY } from "../constants";
import type { SetState } from "ahooks/lib/createUseStorageState";
import { useQuery } from "@tanstack/react-query";
import { getUserApi } from "../api/use-user-api";
import { TAuthUser } from "../type";
import { useDisconnect } from "@reown/appkit/react";

type TProps = {
  children: React.ReactNode;
};

type TAuthContext = {
  isPendingAuthUser: boolean;
  isLogin: boolean;
  isRegistering: boolean;
  setIsRegistering: (register: boolean) => void;
  authUser: TAuthUser | null;
  signInWithGithub: () => Promise<any>;
  setToken: (value?: SetState<string> | undefined) => void;
  refetchAuthUser: () => void;
  logout: () => void;
};

export const AuthContext = React.createContext<TAuthContext>(
  {} as TAuthContext
);

export const AuthProvider = ({ children }: TProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [token, setToken] = useCookieState(LOCAL_STORAGE_TOKEN_KEY, {
    defaultValue: undefined,
    secure: true,
    sameSite: "lax",
  });
  const { disconnect } = useDisconnect();

  const {
    data: authUser,
    isPending: isPendingAuthUser,
    refetch: refetchAuthUser,
  } = useQuery({
    queryKey: ["authUser", token],
    queryFn: async () => {
      const data = await getUserApi();
      if (data.code === 0) {
        return data.data;
      } else {
        // toast.error(data.msg);
        setToken(undefined);
        throw new Error(data.msg);
      }
    },
    enabled: !!token,
  });

  const signInWithGithub = useCallback(() => {
    return new Promise((resolve, reject) => {
      const uri = window.location.href.replace(window.location.origin, "");
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=${window.location.origin}/redirect?uri=${uri}&scope=read:user user:email`;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // 打开新窗口
      const authWindow = window.open(
        authUrl,
        "GitHub 登录",
        isMobile ? "_blank" : "width=600,height=600"
      );

      let settled = false;
      let closedTimer: ReturnType<typeof setInterval> | undefined;

      const cleanup = () => {
        window.removeEventListener("message", handleMessage);
        if (closedTimer) {
          clearInterval(closedTimer);
        }
      };

      // 创建一个只执行一次的事件处理函数
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "github-oauth" && !settled) {
          settled = true;

          // 移除事件监听器，停止轮询
          cleanup();

          // 关闭弹窗
          authWindow?.close();

          // 使用 code 获取 token
          const data = await loginWithGithubApi(event.data.code);
          if (data.data && data.code === 0) {
            resolve(data);
          } else {
            reject(new Error("GitHub 登录失败"));
          }
        }
      };

      // 添加事件监听器
      window.addEventListener("message", handleMessage, false);

      // 用户手动关闭弹窗时，结束等待（稍作延迟，避免与正在传递的消息竞争）
      closedTimer = setInterval(() => {
        if (authWindow?.closed) {
          if (closedTimer) {
            clearInterval(closedTimer);
          }
          setTimeout(() => {
            if (!settled) {
              settled = true;
              cleanup();
              reject(new Error("GitHub 登录已取消"));
            }
          }, 1000);
        }
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setToken(undefined);
    disconnect();
    refetchAuthUser();
  }, [refetchAuthUser]);

  const state = useMemo(
    () => ({
      authUser: authUser ?? null,
      isRegistering,
      signInWithGithub,
      setIsRegistering,
      setToken,
      isLogin: !!token,
      isPendingAuthUser,
      refetchAuthUser,
      logout,
    }),
    [
      authUser,
      isRegistering,
      signInWithGithub,
      setIsRegistering,
      setToken,
      token,
      isPendingAuthUser,
      refetchAuthUser,
      logout,
    ]
  );

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
