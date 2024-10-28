
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
    avatar: string;
    bio: string;
    email: string;
    github: string;
    nickname: string;
    twitter?: string;
    username: string;
    viewer: string;
    wallet: string;
};

export type TAuthBindWalletBody = {
  signData: string;
  mesData: string;
  wallet: string;
};
