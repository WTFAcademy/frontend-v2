'use client'

import React, { useMemo, useState } from 'react';
import { loginWithGithub } from '../api/auth-api';
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

    const signInWithGithub = () => {
        console.log('signInWithGithub');
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/redirect`;
        
        // 打开新窗口进行 GitHub 登录
        const authWindow = window.open(githubAuthUrl, 'GitHub 登录', 'width=600,height=600');

        // 创建具名函数作为事件监听器
        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            
            if (event.data.type === 'github-oauth-success') {
                const code = event.data.code;
                const success = await loginWithOauthCode(code);
                if (success) {
                    console.log('GitHub 登录成功');
                    authWindow?.close();
                }
                // 移除事件监听器
                window.removeEventListener('message', handleMessage);
            }
        };

        // 添加事件监听器
        window.addEventListener('message', handleMessage, false);
    }

    const loginWithOauthCode = async (code: string) => {
        const data = await loginWithGithub(code);
        if (data.data) {
            setData(data.data);
            return true;
        }
        return false;
    }

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
