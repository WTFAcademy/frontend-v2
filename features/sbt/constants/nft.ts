import { base, sepolia } from "viem/chains";

export const OS_LINK = "https://opensea.io/collection/wtf-certificates-base";
export const SBT_ADDRESS = "0x2BBE57dA6DFE615B9cE86B2BD149A953af7385d2";
export const SBT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_SBT_CHAIN_ID);
export const SBT_CHAIN = SBT_CHAIN_ID === base.id ? base : sepolia;
