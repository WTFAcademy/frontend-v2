'use client'

import React, { useMemo, useState, useCallback } from 'react';
import { loginWithGithubApi } from '../api/use-auth-api';
type TProps = {
    children: React.ReactNode;
};

type TAuthUser = {
    login: string;
    avatar_url: string;
    address: string;
};

type TAuthContext = {
    data: TAuthUser | null;
    signInWithGithub: () => void;
    loginWithOauthCode: (code: string) => Promise<boolean>;
}

export const AuthContext = React.createContext<TAuthContext>({} as TAuthContext);

export const AuthProvider = ({ children }: TProps) => {
    const [data, setData] = useState<TAuthUser | null>(null);

    const loginWithOauthCode = useCallback(async (code: string) => {
        const data = await loginWithGithubApi(code);
        if (data.data) {
            setData(data.data);
            return true;
        }
        return false;
    }, []);

    const signInWithGithub = useCallback(() => {
        console.log('signInWithGithub');
        const uri = window.location.href.replace(window.location.origin, '');
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/redirect?uri=${uri}`;
        
        // 打开新窗口
        const authWindow = window.open(authUrl, 'GitHub 登录', 'width=600,height=600');

        // 创建一个只执行一次的事件处理函数
        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            
            if (event.data.type === 'github-oauth') {
                console.log("github-oauth", event.data.code);
                
                // 关闭弹窗
                authWindow?.close();
                
                // 使用 code 获取 token
                const success = await loginWithOauthCode(event.data.code);
                if (success) {
                    console.log('GitHub 登录成功');
                } else {
                    console.error('GitHub 登录失败');
                }

                // 移除事件监听器
                window.removeEventListener('message', handleMessage);
            }
        };

        // 添加事件监听器
        window.addEventListener('message', handleMessage, false);
    }, [loginWithOauthCode]);

    const state = useMemo(() => ({
        data,
        signInWithGithub,
        loginWithOauthCode
    }), [
        data,
        signInWithGithub,
        loginWithOauthCode
    ]);

    return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export default AuthProvider;
