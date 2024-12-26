import { TAuthBindWalletBody, TAuthLoginWithEthereumBody } from "../type";
import { request, TResponse } from "@/lib/request";

export type TLoginWithGithubResponse = {
    avatar: string;
    email: string;
    github: string;
    token: string;
    username: string;
}

export type TGetNonceResponse = {
    nonce: string;
}

export type TBindWalletResponse = {
    address: string;
    provider: string;
}

export const loginWithGithubApi = async (code: string) => {
    const response = await request.post<TResponse<TLoginWithGithubResponse>>(`/login/github`, { code });
    return response.data;
}

export const getNonceApi = async (address: string) => {
    const response = await request.post<TResponse<TGetNonceResponse>>(`/login/nonce`, { address, provider: 'eth' });
    return response.data;
}

export const loginWithEthereumApi = async (body: TAuthLoginWithEthereumBody) => {
    const response = await request.post(`/login/wallet`, body);
    return response.data;
}

export const bindWalletApi = async (body: TAuthBindWalletBody) => {
    const response = await request.post<TResponse<TBindWalletResponse>>(`/user/wallet/bind`, body);
    return response.data;
}