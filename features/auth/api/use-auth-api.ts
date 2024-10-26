import { TAuthLoginWithEthereumBody } from "../type";

export const loginWithGithubApi = async (code: string) => {
    console.log('loginWithGithub', code);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/github_login`, {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export const getNonceApi = async (address: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/nonce`, {
        method: 'POST',
        body: JSON.stringify({ wallet: address }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export const loginWithEthereumApi = async (body: TAuthLoginWithEthereumBody) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}