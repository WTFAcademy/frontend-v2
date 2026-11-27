import { useAccount, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import dayjs from "dayjs";
import { TAuthLoginWithEthereumBody } from "../type";

const useSiwe = () => {
    const { address, chainId } = useAccount();
    const { signMessageAsync } = useSignMessage();

    const signMessage = async (nonce: string, statement?: string) => {
        if (!address || !chainId) throw new Error("Wallet is disconnected");
        const message = new SiweMessage({
            domain: window.location.host,
            address,
            statement: statement || "Sign in with Ethereum to the app.",
            uri: window.location.origin,
            version: "1",
            chainId,
            nonce: nonce,
            expirationTime: dayjs().add(2, "day").toISOString(),
        });

        const signature = await signMessageAsync({
            message: message.prepareMessage(),
        });

        const { data } = await message.verify({
            signature,
            nonce: nonce,
        });

        return {
            data: data as TAuthLoginWithEthereumBody['message'],
            signature,
        };
    }

    return {
        signMessage,
    }
}

export default useSiwe;