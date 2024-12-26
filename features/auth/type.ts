
export type TAuthLoginWithEthereumBody = {
    message: {
        domain: string;
        address: string;
        uri: string;
        version: string;
        statement: string;
        nonce: string;
        chainId: number;
        issuedAt: string;
        expirationTime: string;
    };
    signature: string;
}

export type TAuthUser = {
    id: number;
    uuid: string;
    email: string;
    avatar: string;
    github: string;
    role_id: number;
    role_name: string;
    username: string;
    nickname: string;
    activated: boolean;
    created_at: string;
    updated_at: string;
    permissions: string[];
    wallet_address: string;
    wallet_provider: string;
};

export type TAuthBindWalletBody = {
    message: {
        domain: string;
        address: string;
        uri: string;
        version: string;
        statement: string;
        nonce: string;
        chainId: number;
        issuedAt: string;
        expirationTime: string;
    };
    signature: string;
};
