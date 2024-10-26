
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
