import { TAuthBindWalletBody, TAuthLoginWithEthereumBody } from "../type";
import { request } from "@/lib/request";

export const loginWithGithubApi = async (code: string) => {
    const response = await request.post(`/auth/github_login`, { code });
    return response.data;
}

export const getNonceApi = async (address: string) => {
    const response = await request.post(`/auth/nonce`, { wallet: address });
    return response.data;
}

export const loginWithEthereumApi = async (body: TAuthLoginWithEthereumBody) => {
    const response = await request.post(`/auth/login`, body);
    return response.data;
}

export const bindWalletApi = async (body: TAuthBindWalletBody) => {
    const response = await request.post(`/user/wallet/bind`, body);
    return response.data;
}