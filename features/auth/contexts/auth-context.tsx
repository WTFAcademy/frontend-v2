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
        const uri = window.location.href.replace(window.location.origin, '');
        console.log(uri);
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/redirect?uri=${uri}`;
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